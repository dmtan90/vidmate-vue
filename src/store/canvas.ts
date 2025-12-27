import { defineStore, Store } from 'pinia';
import { ref, computed, watch, reactive } from 'vue';
import { fabric } from "fabric";
import { useEditorStore } from '@/store/editor';
import { Editor } from "@/plugins/editor";
import { Canvas } from "@/plugins/canvas";
import { CanvasAlignment } from "@/plugins/alignment";
import { CanvasAudio } from "@/plugins/audio";
import { CanvasCropper } from "@/plugins/crop";
import { CanvasEffects } from "@/plugins/filters";
import { CanvasGuidelines } from "@/plugins/guidelines";
import { CanvasHistory } from "@/plugins/history";
import { CanvasClipMask } from "@/plugins/mask";
import { CanvasReplace } from "@/plugins/replace";
import { CanvasSelection } from "@/plugins/selection";
import { CanvasTemplate } from "@/plugins/template";
import { CanvasTimeline } from "@/plugins/timeline";
import { CanvasTrimmer } from "@/plugins/trim";
import { CanvasWorkspace } from "@/plugins/workspace";
import { CanvasChart } from "@/plugins/chart";
import { CanvasText } from "@/plugins/text";
import { CanvasAnimations } from "@/plugins/animations";
import { CanvasClone } from "@/plugins/clone";
import { Recorder } from "@/plugins/recorder";
import type { EditorAudioElement, EditorTrim } from "@/types/editor";

// export interface Canvas {
//   editor: Editor;
//   selectionActive: any;
//   cropperActive: any;
//   trimmerActive: any;
//   canvas: any;
//   instance: any;
//   selection: any;
//   workspace: any;
//   recorder: any;
//   cropper: any;
//   trimmer: any;
//   timeline: any;
//   animations: any;
//   audio: any;
//   video: any;
//   text: any;
//   effects: any;
//   elements: any;
// }
// 2. Infer the type of the store instance
type EditorStoreInstance = ReturnType<typeof useEditorStore>;

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    editor: reactive<EditorStoreInstance>({}),
    selectionActive: ref<fabric.Object>(null),
    cropperActive: ref<fabric.Image>(null),
    trimmerActive: ref<EditorTrim>(null)
  }),

  getters: {
    canvas(state) : Canvas {
      return this.editor?.canvas as Canvas;
    },
    instance(state) : fabric.Canvas {
      return this.canvas?.instance;
    },
    selection(state) : CanvasSelection {
      return this.canvas?.selection;
    },
    replacer(state) : CanvasReplace {
      return this.canvas?.replacer;
    },
    workspace(state) : CanvasWorkspace {
      return this.canvas?.workspace;
    },
    recorder(state) : Recorder {
      return this.editor?.recorder as Recorder;
    },
    cropper(state) : CanvasCropper {
      return this.canvas?.cropper;
    },
    trimmer(state) : CanvasTrimmer {
      return this.canvas?.trimmer;
    },
    timeline(state) : CanvasTimeline {
      return this.canvas?.timeline;
    },
    animations(state) : CanvasAnimations {
      return this.canvas?.animations;
    },
    audio(state) : CanvasAudio {
      return this.canvas?.audio;
    },
    text(state) : CanvasText {
      return this.canvas?.text;
    },
    effects(state) : CanvasEffects {
      return this.canvas?.effects;
    },
    elements(state) : fabric.Object[] {
      return this.canvas?.elements;
    },
    alignment(state) : CanvasAlignment {
      return this.canvas?.alignment;
    },
    history(state) : CanvasHistory {
      return this.canvas?.history;
    },
    cloner(state) : CanvasClone {
      return this.canvas?.cloner;
    },
    audioElements(state) : EditorAudioElement[]{
      return this.audio?.elements;
    },
    clipper(state) : CanvasCropper {
      return this.canvas?.clipper;
    }
  },

  actions: {
    registerEvents(){
      this.editor = useEditorStore();
      // this.canvas = ref(this.editor?.canvas);
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
    getClipperActive(){
      return this.clipper?.active;
    },
    updateRefs(){
      // console.log("updateRefs");
      // this.canvas = this.editor?.canvas;
      this.selectionActive = this.getSelectionActive();
      this.cropperActive = this.getCropperActive();
      this.trimmerActive = this.getTrimmerActive();
      // this.selection = this.canvas?.selection;
      // this.workspace = this.canvas?.workspace;
      // this.active = this.canvas?.selection?.active;
      // console.log(this.canvas, this.selection, this.workspace, this.active);
    },

    initializeCanvas(canvas: Canvas, element: HTMLCanvasElement){
      // console.log("initializeCanvas");
      // const canvas = this.editor?.pages[index];
      const workspace = document.getElementById('workspace') as HTMLDivElement;
      if (!canvas || !workspace) return;

      if (!element) {
        canvas.destroy();
      } else {
        canvas.initialize(element, workspace);
      }
      this.updateRefs();
    },

    // initializeThumbnail(element, index){
    //   // console.log("initializeThumbnail");
    //   const canvas = this.editor?.pages[index];
    //   const workspace = document.getElementById('workspace') as HTMLDivElement;
    //   if (!canvas || !workspace) return;

    //   if (!element) {
    //     canvas.destroy();
    //   } else {
    //     canvas.initialize(element, workspace);
    //   }
    // },

    initializeRecorder(canvas: HTMLCanvasElement){
      // console.log("initializeRecorder", element);
      if (!canvas) {
        this.recorder.destroy();
      } else {
        this.recorder.initialize(canvas);
      }
      this.updateRefs();
    },

    onChangeSelection(){
      // console.log("onChangeSelection");
      this.updateRefs();
    }
  }
});