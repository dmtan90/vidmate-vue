import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '@/store/editor';

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    editor: useEditorStore(),
    // selection: computed(() => editor.value?.canvas?.selection),
    // workspace: computed(() => editor.value?.canvas?.workspace),
    // active: computed(() => editor.value?.canvas?.selection?.active),
    // recorder: computed(() => editor.value?.recorder),
    selectionActive: ref(null),
    cropperActive: ref(null),
    trimmerActive: ref(null)
  }),

  getters: {
    canvas(){
      // return computed(() => this.editor?.canvas);
      return this.editor?.canvas
    },
    instance(){
      return this.canvas?.instance;
    },
    selection(){
      return this.canvas?.selection;
    },
    workspace(){
      return this.canvas?.workspace;
    },
    recorder(){
      return this.editor?.recorder;
    },
    cropper(){
      return this.canvas?.cropper;
    },
    trimmer(){
      return this.canvas?.trimmer;
    },
    timeline(){
      return this.canvas?.timeline;
    },
    animations(){
      return this.canvas?.animations;
    },
    audio(){
      return this.canvas?.audio;
    },
    video(){
      return this.canvas?.video;
    },
    text(){
      return this.canvas?.text;
    },
    effects(){
      return this.canvas?.effects;
    },
    elements(){
      return this.canvas?.elements;
    },
  },

  actions: {
    registerEvents(){
      watch([this.editor, this.canvas], (value) => {
        // console.log("Store change events", value);
        this.updateRefs();
      });
    },
    getSelectionActive(){
      return this.selection?.active;
    },
    getCropperActive(){
      return this.cropper?.active;
    },
    getTrimmerActive(){
      return this.trimmer?.active;
    },
    updateRefs(){
      // console.log("updateRefs");
      this.selectionActive = this.getSelectionActive();
      this.cropperActive = this.getCropperActive();
      this.trimmerActive = this.getTrimmerActive();
      // this.selection = this.canvas?.selection;
      // this.workspace = this.canvas?.workspace;
      // this.active = this.canvas?.selection?.active;
      // console.log(this.canvas, this.selection, this.workspace, this.active);
    },

    initializeCanvas(element, index){
      console.log("initializeCanvas");
      const canvas = this.editor.pages[index];
      const workspace = document.getElementById('workspace');
      if (!canvas || !workspace) return;

      if (!element) {
        canvas.destroy();
      } else {
        canvas.initialize(element, workspace);
      }
      this.updateRefs();
    },

    initializeRecorder(element){
      console.log("initializeRecorder");
      if (!element) {
        this.recorder.destroy();
      } else {
        this.recorder.initialize(element);
      }
      this.updateRefs();
    },

    onChangeSelection(){
      // console.log("onChangeSelection");
      this.updateRefs();
    }
  }
});