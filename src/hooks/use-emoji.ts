import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { toast } from 'vue-sonner';
const EMOJI_API_LIST = "https://googlefonts.github.io/noto-emoji-animation/data/api.json";
const EMOJI_STATIC = "https://fonts.gstatic.com/s/e/notoemoji/latest/$emoji_codepoint/emoji.svg";
// const EMOJI_ANIMATED = "https://fonts.gstatic.com/s/e/notoemoji/latest/$emoji_codepoint/512.webp";
const EMOJI_ANIMATED = "https://fonts.gstatic.com/s/e/notoemoji/latest/$emoji_codepoint/512.gif";

export interface EmojiImage {
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

interface EmojiIcon {
  name: string;
  version: number;
  popularity: number;
  codepoint: string;
  unsupported_families: string[];
  categories: string[];
  tags: string[];
  sizes_px: number[];
};

interface EmojiResponse {
  host: string;
  asset_url_pattern: string;
  families: ["Animated Emoji"]
  icons: EmojiIcon[];
};

export interface UseEmojiReturn {
  icons: EmojiImage[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  searchEmoji: (query: string, page?: number, append?: boolean) => Promise<void>;
  searchEmojiAppend: (query: string, page?: number) => Promise<void>;
  loadEmoji: (page?: number, append?: boolean) => Promise<void>;
  loadEmojiAppend: (page?: number) => Promise<void>;
  clearEmoji: () => void;
  refreshEmoji: () => Promise<void>;
}

// Cache for curated templates to avoid unnecessary API calls
interface EmojiCache {
  data: EmojiResponse | null;
  timestamp: number;
}

const emojiCache: EmojiCache = {
  data: null,
  timestamp: 0,
  page: 0,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const LIMIT = 20;

// Function to clear the cache
// const clearEmojiCache = () => {
//   emojiCache.data = null;
//   emojiCache.timestamp = 0;
//   page: number = 0;
// };

let EMOJI_DATA = null;

const cloneDeep = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

export const EMOJI_CATEGORIES = ["Smileys and emotions", "People", "Animals and nature", "Food and drink", "Travel and places", "Activities and events", "Objects", "Symbols", "Flags"];

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
export const useEmoji = defineStore("emojiStore", (): UseTemplatesReturn => {
	const icons = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const totalResults = ref(0);
  const currentPage = ref(0);
  const hasNextPage = ref(false);
  const hasPrevPage = ref(false);

  const clearEmojiCache = () => {
    emojiCache.data = null;
    emojiCache.timestamp = 0;
    emojiCache.page = 0;
  };

  const getStaticIcon = (codepoint) => {
    return EMOJI_STATIC.replace("$emoji_codepoint", codepoint);
  }

  const getAnimatedIcon = (codepoint) => {
    return EMOJI_ANIMATED.replace("$emoji_codepoint", codepoint);
  };

  const fetchEmoji = async (query: string = null, page: number = 0) => {
    try {
      // console.log("fetchEmoji", query, page);
      if(!EMOJI_DATA){
        const response = await fetch(EMOJI_API_LIST);

        if (!response.ok) {
          throw new Error(`EMOJI API error: ${response.status}`);
        }

        const data = await response.json();
        // Transform the data to match the expected format for the video editor
        const transformedIcons = data.icons.map((icon) => ({
          type: "image",
          id: `EMOJI_${icon.codepoint}`,
          details: {
            src: getAnimatedIcon(icon.codepoint), // Use webp
            width: 64,
            height: 64,
            alt: icon.tags[0],
          },
          preview: getStaticIcon(icon.codepoint), // Use svg
          metadata: {
            name: icon.tags[0].replace(":",""),
            title: icon.name,
            version: icon.version,
            categories: icon.categories,
            tags: icon.tags
          },
        }));

        EMOJI_DATA = transformedIcons;
      }
      const DATA = cloneDeep(EMOJI_DATA);
      let icons = DATA.filter((icon) => {
        if(!query){
          return true;
        }

        let name = icon.metadata.name.toLowerCase();
        let categories = icon.metadata.categories.join(",").toLowerCase();
        let _query = query.toLowerCase();
        if(name.includes(_query) || categories.includes(_query)){
          return true;
        }
        return false;
      });

      const totalResults = icons.length;
      let start = page * LIMIT;
      let end = start + LIMIT;
      let next_page = false;
      if(end < totalResults){
        next_page = true;
      }

      if(end > totalResults){
        end = totalResults
      }

      if(start > totalResults){
        icons = [];
      }
      else{
        icons = icons.slice(start, end);
      }
      // console.log(icons)
      return {
        success: true,
        error: "",
        status: 200,
        data: {
          icons: icons,
          total_results: totalResults,
          page: page,
          next_page: next_page,
          prev_page: page > 0,
        }
      };
    } catch (err) {
      console.log(err)
      return {
        success: false,
        error: error,
        status: 500,
      }
    }
  };

  const searchEmoji = async (query: string, page: number = 0, append: boolean = false) => {
    if(!append){
      icons.value = [];
    }
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchEmoji(query, page);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      icons.value.push(...data.icons);
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

  const searchEmojiAppend = async (query: string, page: number = 0) => {
    searchEmoji(query, page, true);
  };

  const loadEmoji = async (page: number = 0, append: boolean = false) => {
    if(!append){
      icons.value = [];
    }
    const now = Date.now();
    const isCacheValid = emojiCache.data && emojiCache.page === page && now - emojiCache.timestamp < CACHE_DURATION;

    if (isCacheValid && emojiCache.data) {
      const data = emojiCache.data;
      icons.value = data.icons;
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
      error.value = null;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await fetchEmoji(null, page);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      emojiCache.data = data;
      emojiCache.timestamp = now;
      emojiCache.page = page;

      icons.value.push(...data.icons);
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch icons";
      toast.error(error.value);
      if(!append){
        icons.value = [];
      }
    } finally {
      loading.value = false;
    }
  };

  const loadEmojiAppend = async (page: number = 0) => {
    loadEmoji(page, true);
  };

  const clearEmoji = () => {
    icons.value = [];
    error.value = null;
    totalResults.value = 0;
    clearEmojiCache();
  };

  const refreshEmoji = async () => {
    clearEmojiCache();
    await loadEmoji();
  };

  return {
    icons,
    loading,
    error,
    totalResults,
    currentPage,
    hasNextPage,
    hasPrevPage,
    searchEmoji,
    searchEmojiAppend,
    loadEmoji,
    loadEmojiAppend,
    clearEmoji,
    refreshEmoji,
  };
});
