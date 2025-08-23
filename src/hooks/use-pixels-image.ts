import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { GET } from "@/api/pixels-image";
import { toast } from 'vue-sonner';
export interface PexelsImage {
	type: "image";
    details: {
    	src: string;
	    background: string;
	    width: number;
	    height: number;
	    opacity: number;
	    transform: string;
	    border: string;
	    borderRadius: number;
	    boxShadow: {
	    	color: string;
		    x: number;
		    y: number;
		    blur: number;
	    };
	    top: string;
	    left: string;
	    transformOrigin: string;
	    crop: {
	        x: number;
	        y: number;
	        width: number;
	        height: number;
	    };
	    blur: number;
	    brightness: number;
	    flipX: boolean;
	    flipY: boolean;
	    rotate: string;
	    visibility: "visible" | "hidden";
    };
	metadata?: {
		pexels_id: number;
		avg_color: string;
		original_url: string;
	};
}

export interface PexelsResponse {
	photos: PexelsImage[];
	total_results: number;
	page: number;
	per_page: number;
	next_page?: string;
	prev_page?: string;
}

export interface UsePexelsImagesReturn {
	images: PexelsImage[];
	loading: boolean;
	error: string | null;
	totalResults: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	searchImages: (query: string, page?: number) => Promise<void>;
	loadCuratedImages: (page?: number) => Promise<void>;
	searchImagesAppend: (query: string, page?: number) => Promise<void>;
	loadCuratedImagesAppend: (page?: number) => Promise<void>;
	clearImages: () => void;
	refreshCuratedImages: (page?: number) => Promise<void>;
}

// Cache for curated images to avoid unnecessary API calls
interface CuratedImagesCache {
	data: PexelsResponse | null;
	timestamp: number;
	page: number;
}

const curatedImagesCache: CuratedImagesCache = {
	data: null,
	timestamp: 0,
	page: 1,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Function to clear the cache
const clearCuratedImagesCache = () => {
	curatedImagesCache.data = null;
	curatedImagesCache.timestamp = 0;
	curatedImagesCache.page = 1;
};

export const PIXELS_IMAGE_CATEGORIES = ["Business", "Gradient Photo Background", "Fashion", "Technology", "Photo Background", "Real Estate", "Animal", "Entertainment", "Music", "Event", "Nature", "Sport", "Education", "Travel", "Celebration", "Food", "Photography", "Kids", "Transportation", "Art", "Wedding", "Industrial"];

/**
 * Hook for fetching and managing Pexels images with caching support.
 *
 * Features:
 * - Caches curated images for 5 minutes to avoid unnecessary API calls
 * - Supports search functionality with real-time results
 * - Provides pagination for browsing large result sets
 * - Includes error handling and loading states
 *
 * Cache Behavior:
 * - Curated images are cached for 5 minutes
 * - Cache is automatically cleared when calling clearImages()
 * - Manual cache refresh available via refreshCuratedImages()
 * - Cache is page-specific (different pages have separate cache entries)
 */
export const usePexelsImages = defineStore("pixelsImages", (): UsePexelsImagesReturn => {
	const images = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const totalResults = ref(0);
    const currentPage = ref(1);
    const hasNextPage = ref(false);
    const hasPrevPage = ref(false);

    const clearCuratedImagesCache = () => {
      curatedImagesCache.data = null;
      curatedImagesCache.timestamp = 0;
      curatedImagesCache.page = 1;
    };

    const fetchImages = async (url) => {
      loading.value = true;
      error.value = null;

      try {
        const response = await GET(url);//fetch(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;

        images.value = data.photos;
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to fetch images";
        toast.error(error.value);
        images.value = [];
      } finally {
        loading.value = false;
      }
    };

    const searchImages = async (query, page = 1) => {
      const url = `/api/pexels?query=${encodeURIComponent(query)}&page=${page}&per_page=20`;
      await fetchImages(url);
    };

    const searchImagesAppend = async (query, page = 1) => {
      loading.value = true;
      error.value = null;

      try {
        const url = `/api/pexels?query=${encodeURIComponent(query)}&page=${page}&per_page=20`;
        const response = await GET(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;

        images.value.push(...data.photos);
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to fetch images";
        toast.error(error.value);
      } finally {
        loading.value = false;
      }
    };

    const loadCuratedImages = async (page = 1) => {
    	console.log("loadCuratedImages", page);
      const now = Date.now();
      const isCacheValid = curatedImagesCache.data && curatedImagesCache.page === page && now - curatedImagesCache.timestamp < CACHE_DURATION;

      if (isCacheValid && curatedImagesCache.data) {
        const data = curatedImagesCache.data;
        images.value = data.photos;
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
        error.value = null;
        return;
      }

      const url = `/api/pexels?page=${page}&per_page=20`;
      loading.value = true;
      error.value = null;

      try {
        const response = await GET(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;

        curatedImagesCache.data = data;
        curatedImagesCache.timestamp = now;
        curatedImagesCache.page = page;

        images.value = data.photos;
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to fetch images";
        toast.error(error.value);
        images.value = [];
      } finally {
        loading.value = false;
      }
    };

    const loadCuratedImagesAppend = async (page = 1) => {
      loading.value = true;
      error.value = null;

      try {
        const url = `/api/pexels?page=${page}&per_page=20`;
        const response = await GET(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;

        images.value.push(...data.photos);
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to fetch images";
        toast.error(error.value);
      } finally {
        loading.value = false;
      }
    };

    const clearImages = () => {
      images.value = [];
      error.value = null;
      totalResults.value = 0;
      currentPage.value = 1;
      hasNextPage.value = false;
      hasPrevPage.value = false;
      clearCuratedImagesCache();
    };

    const refreshCuratedImages = async (page = 1) => {
      clearCuratedImagesCache();
      await loadCuratedImages(page);
    };

    return {
      images,
      loading,
      error,
      totalResults,
      currentPage,
      hasNextPage,
      hasPrevPage,
      searchImages,
      loadCuratedImages,
      searchImagesAppend,
      loadCuratedImagesAppend,
      clearImages,
      refreshCuratedImages,
    };
});
