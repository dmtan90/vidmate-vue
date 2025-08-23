import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { toast } from 'vue-sonner';
import { GET } from "@/api/pixels-video";

export interface PexelsVideo {
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

interface PexelsVideoResponse {
	videos: PexelsVideo[];
	total_results: number;
	page: number;
	per_page: number;
	next_page?: string;
	prev_page?: string;
}

interface UsePexelsVideosReturn {
	videos: PexelsVideo[];
	loading: boolean;
	error: string | null;
	totalResults: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	searchVideos: (query: string, page?: number) => Promise<void>;
	loadPopularVideos: (page?: number) => Promise<void>;
	searchVideosAppend: (query: string, page?: number) => Promise<void>;
	loadPopularVideosAppend: (page?: number) => Promise<void>;
	clearVideos: () => void;
	refreshPopularVideos: (page?: number) => Promise<void>;
}

// Cache for popular videos to avoid unnecessary API calls
interface PopularVideosCache {
	data: PexelsVideoResponse | null;
	timestamp: number;
	page: number;
}

const popularVideosCache: PopularVideosCache = {
	data: null,
	timestamp: 0,
	page: 1,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Function to clear the cache
const clearPopularVideosCache = () => {
	popularVideosCache.data = null;
	popularVideosCache.timestamp = 0;
	popularVideosCache.page = 1;
};

export const PIXELS_VIDEO_CATEGORIES = ["Business", "Background", "Abstract", "Birthday", "Nature", "Technology", "Animation", "Travel", "Technology Background", "Wedding", "Finance", "Holiday", "Emotion", "Food", "Family", "People", "Fashion", "Music", "Education", "Social", "Real Estate", "Health", "Animal", "Delivery", "Art", "Sport", "Life", "Color"];

/**
 * Hook for fetching and managing Pexels videos with caching support.
 *
 * Features:
 * - Caches popular videos for 5 minutes to avoid unnecessary API calls
 * - Supports search functionality with real-time results
 * - Provides pagination for browsing large result sets
 * - Includes error handling and loading states
 *
 * Cache Behavior:
 * - Popular videos are cached for 5 minutes
 * - Cache is automatically cleared when calling clearVideos()
 * - Manual cache refresh available via refreshPopularVideos()
 * - Cache is page-specific (different pages have separate cache entries)
 */
export const usePexelsVideos = defineStore("pixelsVideos", (): UsePexelsVideosReturn => {
	const videos = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const totalResults = ref(0);
    const currentPage = ref(1);
    const hasNextPage = ref(false);
    const hasPrevPage = ref(false);

    const fetchVideos = async (url) => {
      loading.value = true;
      error.value = null;

      try {
        const response = await GET(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        videos.value = data.videos;
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch videos';
        videos.value = [];
      } finally {
        loading.value = false;
      }
    };

    const searchVideos = async (query, page = 1) => {
      const url = `/api/pexels-videos?query=${encodeURIComponent(query)}&page=${page}&per_page=15`;
      await fetchVideos(url);
    };

    const searchVideosAppend = async (query, page = 1) => {
      loading.value = true;
      error.value = null;

      try {
        const url = `/api/pexels-videos?query=${encodeURIComponent(query)}&page=${page}&per_page=15`;
        const response = await GET(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        videos.value.push(...data.videos);
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch videos';
      } finally {
        loading.value = false;
      }
    };

    const loadPopularVideos = async (page = 1) => {
      const now = Date.now();
      const isCacheValid =
        popularVideosCache.data &&
        popularVideosCache.page === page &&
        now - popularVideosCache.timestamp < CACHE_DURATION;

      if (isCacheValid && popularVideosCache.data) {
        const data = popularVideosCache.data;
        videos.value = data.videos;
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
        error.value = null;
        return;
      }

      const url = `/api/pexels-videos?page=${page}&per_page=15`;
      loading.value = true;
      error.value = null;

      try {
        const response = await GET(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        popularVideosCache.data = data;
        popularVideosCache.timestamp = now;
        popularVideosCache.page = page;

        videos.value = data.videos;
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch videos';
        videos.value = [];
      } finally {
        loading.value = false;
      }
    };

    const loadPopularVideosAppend = async (page = 1) => {
      loading.value = true;
      error.value = null;

      try {
        const url = `/api/pexels-videos?page=${page}&per_page=15`;
        const response = await GET(url);
        if (!response.success) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        videos.value.push(...data.videos);
        totalResults.value = data.total_results;
        currentPage.value = data.page;
        hasNextPage.value = !!data.next_page;
        hasPrevPage.value = !!data.prev_page;
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch videos';
      } finally {
        loading.value = false;
      }
    };

    const clearVideos = () => {
      videos.value = [];
      error.value = null;
      totalResults.value = 0;
      currentPage.value = 1;
      hasNextPage.value = false;
      hasPrevPage.value = false;
      clearPopularVideosCache();
    };

    const refreshPopularVideos = async (page = 1) => {
      clearPopularVideosCache();
      await loadPopularVideos(page);
    };

    return {
      videos,
      loading,
      error,
      totalResults,
      currentPage,
      hasNextPage,
      hasPrevPage,
      searchVideos,
      loadPopularVideos,
      searchVideosAppend,
      loadPopularVideosAppend,
      clearVideos,
      refreshPopularVideos,
    };
});
