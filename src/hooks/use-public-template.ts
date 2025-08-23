import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { EditorTemplate } from "@/types/editor";
import { fetchVideoTemplates, type FetchTemplateParams } from "@/api/template";
import { toast } from 'vue-sonner';

export interface UseTemplatesReturn {
	templates: EditorTemplate[];
	loading: boolean;
	error: string | null;
	totalResults: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	searchTemplates: (query: string, page?: number) => Promise<void>;
	loadCuratedTemplates: (page?: number) => Promise<void>;
	searchTemplatesAppend: (query: string, page?: number) => Promise<void>;
	loadCuratedTemplatesAppend: (page?: number) => Promise<void>;
	clearTemplates: () => void;
	refreshCuratedTemplates: (page?: number) => Promise<void>;
}

// Cache for curated templates to avoid unnecessary API calls
interface CuratedTemplatesCache {
	data: PexelsResponse | null;
	timestamp: number;
	page: number;
}

const curatedTemplatesCache: CuratedTemplatesCache = {
	data: null,
	timestamp: 0,
	page: 1,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Function to clear the cache
const clearCuratedTemplatesCache = () => {
	curatedTemplatesCache.data = null;
	curatedTemplatesCache.timestamp = 0;
	curatedTemplatesCache.page = 0;
};

const DEFAULT_LIMIT = 100;

/**
 * Hook for fetching and managing Pexels templates with caching support.
 *
 * Features:
 * - Caches curated templates for 5 minutes to avoid unnecessary API calls
 * - Supports search functionality with real-time results
 * - Provides pagination for browsing large result sets
 * - Includes error handling and loading states
 *
 * Cache Behavior:
 * - Curated templates are cached for 5 minutes
 * - Cache is automatically cleared when calling cleartemplates()
 * - Manual cache refresh available via refreshCuratedtemplates()
 * - Cache is page-specific (different pages have separate cache entries)
 */
export const usePublicTemplates = defineStore("publicTemplates", (): UseTemplatesReturn => {
	const templates = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const totalResults = ref(0);
  const currentPage = ref(0);
  const hasNextPage = ref(false);
  const hasPrevPage = ref(false);

  const clearCuratedTemplatesCache = () => {
    curatedTemplatesCache.data = null;
    curatedTemplatesCache.timestamp = 0;
    curatedTemplatesCache.page = 0;
  };

  const fetchTemplates = async (url) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchVideoTemplates(url);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      templates.value = data.templates;
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch templates";
      toast.error(error.value);
      templates.value = [];
    } finally {
      loading.value = false;
    }
  };

  const searchtemplates = async (query, page = 0) => {
    const url = `/api/templates?query=${encodeURIComponent(query)}&page=${page}&per_page=${DEFAULT_LIMIT}&public=true`;
    await this.fetchTemplates(url);
  };

  const searchtemplatesAppend = async (query, page = 0) => {
    loading.value = true;
    error.value = null;

    try {
      const url = `/api/templates?query=${encodeURIComponent(query)}&page=${page}&per_page=${DEFAULT_LIMIT}&public=true`;
      const response = await fetchVideoTemplates(url);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      templates.value.push(...data.templates);
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch templates";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const loadCuratedtemplates = async (page = 0) => {
    console.log("loadCuratedtemplates", page);
    const now = Date.now();
    const isCacheValid = curatedTemplatesCache.data && curatedTemplatesCache.page === page && now - curatedTemplatesCache.timestamp < CACHE_DURATION;

    if (isCacheValid && curatedTemplatesCache.data) {
      const data = curatedTemplatesCache.data;
      templates.value = data.templates;
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
      error.value = null;
      return;
    }

    const url = `/api/templates?page=${page}&per_page=${DEFAULT_LIMIT}&public=true`;
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchVideoTemplates(url);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      curatedTemplatesCache.data = data;
      curatedTemplatesCache.timestamp = now;
      curatedTemplatesCache.page = page;

      templates.value = data.templates;
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      console.log(err);
      error.value = err instanceof Error ? err.message : "Failed to fetch templates";
      toast.error(error.value);
      templates.value = [];
    } finally {
      loading.value = false;
    }
  };

  const loadCuratedtemplatesAppend = async (page = 0) => {
    console.log("loadCuratedtemplatesAppend", page);
    loading.value = true;
    error.value = null;

    try {
      const url = `/api/templates?page=${page}&per_page=${DEFAULT_LIMIT}&public=true`;
      const response = await fetchVideoTemplates(url);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      templates.value.push(...data.templates);
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch templates";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const cleartemplates = () => {
    templates.value = [];
    error.value = null;
    totalResults.value = 0;
    currentPage.value = 0;
    hasNextPage.value = false;
    hasPrevPage.value = false;
    clearCuratedTemplatesCache();
  };

  const refreshCuratedtemplates = async (page = 0) => {
    clearCuratedTemplatesCache();
    await loadCuratedtemplates(page);
  };

  return {
    templates,
    loading,
    error,
    totalResults,
    currentPage,
    hasNextPage,
    hasPrevPage,
    searchtemplates,
    loadCuratedtemplates,
    searchtemplatesAppend,
    loadCuratedtemplatesAppend,
    cleartemplates,
    refreshCuratedtemplates,
  };
});
