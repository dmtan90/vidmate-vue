import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useEditorStore } from '@/store/editor';
import { type AdapterProps } from "@/plugins/adapter"
import { type Editor } from "./editor"

export const useAdapterStore = defineStore('adapter', {
  state: () => ({
    editor: useEditorStore(),
  }),

  getters: {
    adapter(){
      return this.editor.adapter;
    }
  },

  actions: {
    initialize(props: AdapterProps){
      this.adapter.initialize(props);
    },

    update(props: Partial<AdapterProps>){
      this.adapter.update(props);
    }
  }
});