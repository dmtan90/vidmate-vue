import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { toast } from 'vue-sonner';
const MUSIC_API_LIST = "https://resource.flexclip.com/json/stock//audio/stock_audio-audio-1.json";
const SOUND_API_LIST = "https://resource.flexclip.com/json/stock//audio/stock_audio-audioSoundEffect-1.json";

enum AudioType {
  MUSIC = "music",
  FX = "sfx"
}

interface LocalizeItem {
  "ar": string;
  "cn": string;
  "de": string;
  "en": string;
  "es": string;
  "fr": string;
  "jp": string;
  "pt": string;
  "tw": string;
}

interface AudioItem {
  "bpm": number;
  "contentClass": string;
  "duration": number;
  "durationMs": number;
  "id": number;
  "is_new": boolean;
  "preview_url": string;
  "thumbnail_url": string;
  "title": string;
  "type": AudioType;
  "waveform_url": string;
};

interface CategoryItem {
  cateName: string;
  data: AudioItem[];
  localization: LocalizeItem;
  sort: number;
};

interface AudioResponse {
  category: CategoryItem[],
  popular: CategoryItem[],
  recently_used: CategoryItem[],
}

export interface UseAudioReturn {
  sounds: AudioItem[];
  musics: AudioItem[];
  soundCategories: CategoryItem[];
  musicCategories: CategoryItem[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  searchSound: (query: string, category?: string, page?: number, append?: boolean) => Promise<void>;
  searchMusic: (query: string, category?: string, page?: number, append?: boolean) => Promise<void>;
  searchSoundAppend: (query: string, category?: string, page?: number) => Promise<void>;
  searchMusicAppend: (query: string, category?: string, page?: number) => Promise<void>;
  loadSound: (category?: string, page?: number, append?: boolean) => Promise<void>;
  loadSoundAppend: (category?: string, page?: number) => Promise<void>;
  loadMusic: (category?: string, page?: number, append?: boolean) => Promise<void>;
  loadMusicAppend: (category?: string, page?: number) => Promise<void>;
  clearSound: () => void;
  refreshSound: () => Promise<void>;
  clearMusic: () => void;
  refreshMusic: () => Promise<void>;
}

// Cache for curated templates to avoid unnecessary API calls
interface AudioCache {
  data: AudioResponse | null;
  timestamp: number;
  page: number;
}

const soundCache: AudioCache = {
  data: null,
  timestamp: 0,
  page: 0,
};

const musicCache: AudioCache = {
  data: null,
  timestamp: 0,
  page: 0,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const LIMIT = 10;

let SOUND_DATA = null;
let MUSIC_DATA = null;

const cloneDeep = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

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
export const useAudioStore = defineStore("audioStore", (): UseAudioReturn => {
  const sounds = ref([]);
  const musics = ref([]);
  const soundCategories = ref([]);
  const musicCategories = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const totalResults = ref(0);
  const currentPage = ref(0);
  const hasNextPage = ref(false);
  const hasPrevPage = ref(false);

  const clearAudioCache = () => {
    soundCache.data = null;
    soundCache.timestamp = 0;
    soundCache.page = 0;

    musicCache.data = null;
    musicCache.timestamp = 0;
    musicCache.page = 0;
  };

  const fetchSound = async (query: string = null, category: string = null, page: number = 0) => {
    try {
      console.log("fetchSound", query, category, page);
      if(!SOUND_DATA){
        const response = await fetch(SOUND_API_LIST);

        if (!response.ok) {
          throw new Error(`SOUND API error: ${response.status}`);
        }

        const data = await response.json();
        // Transform the data to match the expected format for the EditorAudio editor
        const transformedSounds = data.category.map((category) => {
          category.data = category.data.map((sound) => ({
            source: sound.preview_url,
            name: sound.title,
            thumbnail: sound.thumbnail_url,
            duration: sound.duration
          }));
          return category;
        });

        SOUND_DATA = transformedSounds;
        soundCategories.value = cloneDeep(SOUND_DATA);
      }

      const DATA = cloneDeep(SOUND_DATA);
      let categories = DATA.filter((cate) => {
        if(!query && !category){
          return true;
        }

        if((category && category == cate.cateName) || !category){
          //filter sounds
          if(query){
            let _query = query.toLowerCase();
            cate.data = cate.data.filter((sound) => {
              const name = sound.name.toLowerCase();
              if(name.includes(_query)){
                return true;
              }
              return false;
            });
          }

          if(cate.data.length > 0){
            return true;
          }
        }

        return false;
      });

      let audios = [];
      categories.forEach((cate) => {
        audios.push(...cate.data);
      });

      const totalResults = audios.length;
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
        audios = [];
      }
      else{
        audios = audios.slice(start, end);
      }
      // console.log(audios)
      return {
        success: true,
        error: "",
        status: 200,
        data: {
          audios: audios,
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

  const fetchMusic = async (query: string = null, category: string = null, page: number = 0) => {
    try {
      console.log("fetchMusic", query, category, page);
      if(!MUSIC_DATA){
        const response = await fetch(MUSIC_API_LIST);

        if (!response.ok) {
          throw new Error(`MUSIC API error: ${response.status}`);
        }

        const data = await response.json();
        // Transform the data to match the expected format for the EditorAudio editor
        const transformedSounds = data.category.map((category) => {
          category.data = category.data.map((sound) => ({
            source: sound.preview_url,
            name: sound.title,
            thumbnail: sound.thumbnail_url,
            duration: sound.duration
          }));
          return category;
        });

        MUSIC_DATA = transformedSounds;
        musicCategories.value = cloneDeep(MUSIC_DATA);
      }

      const DATA = cloneDeep(MUSIC_DATA);
      let categories = DATA.filter((cate) => {
        if(!query && !category){
          return true;
        }

        if((category && category == cate.cateName) || !category){
          //filter sounds
          if(query){
            let _query = query.toLowerCase();
            cate.data = cate.data.filter((sound) => {
              const name = sound.name.toLowerCase();
              if(name.includes(_query)){
                return true;
              }
              return false;
            });  
          }

          if(cate.data.length > 0){
            return true;
          }
        }

        return false;
      });

      let audios = [];
      categories.forEach((cate) => {
        audios.push(...cate.data);
      });

      const totalResults = audios.length;
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
        audios = [];
      }
      else{
        audios = audios.slice(start, end);
      }
      // console.log(audios)
      return {
        success: true,
        error: "",
        status: 200,
        data: {
          audios: audios,
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

  const searchSound = async (query: string, category: string, page: number = 0, append: boolean = false) => {
    if(!append){
      sounds.value = [];
    }
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchSound(query, category, page);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      sounds.value.push(...data.audios);
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch sounds";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const searchSoundAppend = async (query: string, category: string, page: number = 0) => {
    searchSound(query, category, page, true);
  };

  const searchMusic = async (query: string, category: string, page: number = 0, append: boolean = false) => {
    if(!append){
      musics.value = [];
    }
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchMusic(query, category, page);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      musics.value.push(...data.audios);
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch musics";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const searchMusicAppend = async (query: string, category: string, page: number = 0) => {
    searchMusic(query, category, page, true);
  };

  const loadSound = async (category: string = null, page: number = 0, append: boolean = false) => {
    if(!append){
      sounds.value = [];
    }
    const now = Date.now();
    const isCacheValid = soundCache.data && soundCache.page === page && now - soundCache.timestamp < CACHE_DURATION;

    if (isCacheValid && soundCache.data) {
      const data = soundCache.data;
      sounds.value = data.audios;
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
      const response = await fetchSound(null, category, page);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      soundCache.data = data;
      soundCache.timestamp = now;
      soundCache.page = page;

      sounds.value.push(...data.audios);
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch sounds";
      toast.error(error.value);
      if(!append){
        sounds.value = [];
      }
    } finally {
      loading.value = false;
    }
  };

  const loadSoundAppend = async (category: string, page: number = 0) => {
    loadSound(category, page, true);
  };

  const loadMusic = async (category: string = null, page: number = 0, append: boolean = false) => {
    if(!append){
      musics.value = [];
    }
    const now = Date.now();
    const isCacheValid = musicCache.data && musicCache.page === page && now - musicCache.timestamp < CACHE_DURATION;

    if (isCacheValid && musicCache.data) {
      const data = musicCache.data;
      musics.value = data.audios;
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
      const response = await fetchMusic(null, category, page);
      if (!response.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      musicCache.data = data;
      musicCache.timestamp = now;
      musicCache.page = page;

      musics.value.push(...data.audios);
      totalResults.value = data.total_results;
      currentPage.value = data.page;
      hasNextPage.value = !!data.next_page;
      hasPrevPage.value = !!data.prev_page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch musics";
      toast.error(error.value);
      if(!append){
        musics.value = [];
      }
    } finally {
      loading.value = false;
    }
  };

  const loadMusicAppend = async (category: string, page: number = 0) => {
    loadMusic(category, page, true);
  };

  const clearSound = () => {
    sounds.value = [];
    error.value = null;
    totalResults.value = 0;
    clearAudioCache();
  };

  const clearMusic = () => {
    musics.value = [];
    error.value = null;
    totalResults.value = 0;
    clearAudioCache();
  };

  const refreshSound = async () => {
    clearAudioCache();
    await loadSound();
  };

  const refreshMusic = async () => {
    clearAudioCache();
    await loadMusic();
  };

  return {
    sounds,
    musics,
    soundCategories,
    musicCategories,
    loading,
    error,
    totalResults,
    currentPage,
    hasNextPage,
    hasPrevPage,
    searchSound,
    searchSoundAppend,
    loadSound,
    loadSoundAppend,
    clearSound,
    refreshSound,
    searchMusic,
    searchMusicAppend,
    loadMusic,
    loadMusicAppend,
    clearMusic,
    refreshMusic,
  };
});
