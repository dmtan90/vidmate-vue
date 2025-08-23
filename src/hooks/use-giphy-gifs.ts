import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { GET_GIF } from "@/api/giphy";
import { toast } from 'vue-sonner';
export interface GiphyGIF {
  type: "video";
  details: {
    src: string;
    frames?: number;
    background?: string;
    stream?: ReadableStream<Uint8Array>;
    blob?: Blob;
    width: number;
    height: number;
    volume?: number;
    boxShadow?: {
      color: string;
      x: number;
      y: number;
      blur: number;
    };
    transformOrigin?: string;
    crop?: {
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
    user: {
      id: number;
      name: string;
      url: string;
    };
    video_files: Array<{
      id: number;
      quality: string;
      file_type: string;
      width: number;
      height: number;
      fps: number;
      link: string;
    }>;
    video_pictures: Array<{
      id: number;
      picture: string;
      nr: number;
    }>;
  };
}

export interface GiphyResponse {
	photos: GiphyGIF[];
	total_results: number;
	page: number;
	per_page: number;
	next_page?: string;
	prev_page?: string;
}

export interface GiphyGIFsReturn {
	images: GiphyGIF[];
	loading: boolean;
	error: string | null;
	totalResults: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	searchGifs: (query: string, page?: number) => Promise<void>;
	loadTrendGifs: (page?: number) => Promise<void>;
	searchGifsAppend: (query: string, page?: number) => Promise<void>;
	loadTrendGifsAppend: (page?: number) => Promise<void>;
	clearImages: () => void;
	refreshTrendGifs: (page?: number) => Promise<void>;
}

// Cache for curated images to avoid unnecessary API calls
interface TrendGifCache {
	data: GiphyResponse | null;
	timestamp: number;
	page: number;
}

const trendGifCache: TrendGifCache = {
	data: null,
	timestamp: 0,
	page: 1,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const GIFS_CATEGORIES = ["Actions", "Adjectives", "Animals","Anime","Art & Design","Cartoons & Comics","Celebrities","Decades","Emotions","Fashion & Beauty","Food & Drink","Gaming","Greetings","Holidays","Identity","Interests","Memes","Movies","Music","Nature","News & Politics","Reactions","Science","Sports","Stickers","Transportation","TV", "Weird"];

// Function to clear the cache
// const clearTrendGifCache = () => {
// 	trendGifCache.data = null;
// 	trendGifCache.timestamp = 0;
// 	trendGifCache.page = 0;
// };

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
 * - Manual cache refresh available via refreshTrendGifs()
 * - Cache is page-specific (different pages have separate cache entries)
 */
export const useGiphyGIFs = defineStore("GiphyGIF", (): GiphyGIFsReturn => {
	const images = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const totalResults = ref(0);
  const currentPage = ref(0);
  const hasNextPage = ref(false);
  const hasPrevPage = ref(false);

  const clearTrendGifCache = () => {
    trendGifCache.data = null;
    trendGifCache.timestamp = 0;
    trendGifCache.page = 0;
  };

  const fetchImages = async (url) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await GET_GIF(url);
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

  const searchGifs = async (query, page = 0) => {
    const url = `/api/giphy?query=${encodeURIComponent(query)}&page=${page}&per_page=20`;
    await fetchImages(url);
  };

  const searchGifsAppend = async (query, page = 0) => {
    loading.value = true;
    error.value = null;

    try {
      const url = `/api/giphy?query=${encodeURIComponent(query)}&page=${page}&per_page=20`;
      const response = await GET_GIF(url);
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

  const loadTrendGifs = async (page = 0) => {
  	// console.log("loadTrendGifs", page);
    const now = Date.now();
    const isCacheValid = trendGifCache.data && trendGifCache.page === page && now - trendGifCache.timestamp < CACHE_DURATION;

    if (isCacheValid && trendGifCache.data) {
      const data = trendGifCache.data;
      images.value = data.photos;
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
      error.value = null;
      return;
    }

    const url = `/api/giphy?page=${page}&per_page=20`;
    loading.value = true;
    error.value = null;

    try {
      const response = await GET_GIF(url);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      trendGifCache.data = data;
      trendGifCache.timestamp = now;
      trendGifCache.page = page;

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

  const loadTrendGifsAppend = async (page = 0) => {
    loading.value = true;
    error.value = null;

    try {
      const url = `/api/giphy?page=${page}&per_page=20`;
      const response = await GET_GIF(url);
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
    currentPage.value = 0;
    hasNextPage.value = false;
    hasPrevPage.value = false;
    clearTrendGifCache();
  };

  const refreshTrendGifs = async (page = 0) => {
    clearTrendGifCache();
    await loadTrendGifs(page);
  };

  return {
    images,
    loading,
    error,
    totalResults,
    currentPage,
    hasNextPage,
    hasPrevPage,
    searchGifs,
    loadTrendGifs,
    searchGifsAppend,
    loadTrendGifsAppend,
    clearImages,
    refreshTrendGifs,
  };
});
