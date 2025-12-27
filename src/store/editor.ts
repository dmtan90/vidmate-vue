import { markRaw, ref, computed } from "vue"
import { nanoid } from "nanoid";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { defineStore } from 'pinia';

import { Editor, type EditorStatus, type EditorMode, type ExportProgress, type ExportMode } from "@/plugins/editor";
import { Canvas } from "@/plugins/canvas";
import { Prompt } from "@/plugins/prompt";
import { Recorder } from "@/plugins/recorder";
import { Adapter } from "@/plugins/adapter";
import { convertBufferToWaveBlob } from "@/lib/media";
import { createInstance } from "@/lib/utils";
import { FabricUtils } from "@/fabric/utils";
import { propertiesToInclude } from "@/fabric/constants";
import type { EditorAudioElement, EditorTemplate, EditorTemplatePage } from "@/types/editor";

export const useEditorStore = defineStore('editor', {
  state: () => ({
    _editor: createInstance(Editor) as Editor,
  }),

  getters: {
    instance(state) : Editor {
      return this._editor;
    },
    page(state) : number {
      return this._editor.page;
    },
    id(state) : string {
      return this._editor.id;
    },
    mode(state){
      return this._editor.mode;
    },
    name(state) : string {
      return this._editor.name;
    },
    status(state){
      return this._editor.status;
    },
    pages(state) : Canvas[] {
      return this._editor.pages as Canvas[];
    },
    controller(state){
      return this._editor.controller;
    },
    adapter(state){
      return this._editor.adapter;
    },
    prompter(state){
      return this._editor.prompter;
    },
    recorder(state){
      return this._editor.recorder;
    },
    saving(state){
      return this._editor.saving;
    },
    preview(state){
      return this._editor.preview;
    },
    exporting(state){
      return this._editor.exporting;
    },
    ffmpeg(state){
      return this._editor.ffmpeg;
    },
    progress(state){
      return this._editor.progress;
    },
    blob(state){
      return this._editor.blob;
    },
    frame(state){
      return this._editor.frame;
    },
    file(state){
      return this._editor.file;
    },
    fps(state){
      return this._editor.fps;
    },
    codec(state){
      return this._editor.codec;
    },
    exports(state){
      return this._editor.exports;
    },
    sidebarLeft(state){
      return this._editor.sidebarLeft;
    },
    sidebarRight(state){
      return this._editor.sidebarRight;
    },
    timelineOpen(state){
      return this._editor.timelineOpen;
    },
    canvas(state) : Canvas {
      return this._editor?.canvas as Canvas;
    },
    dimension() {
      return this._editor?.dimension;
    },
    timelineOpen(){
      return this._editor.timelineOpen;
    }
  },

  actions: {
    _progressEvent({ progress, frame }: { progress: number; frame?: string }) {
      this._editor._progressEvent({ progress, frame });
    },

    async initialize(mode?: EditorMode) {
      this._editor.initialize(mode);
    },

    async exportAudio() {
      return this._editor.exportAudio();
    },

    async exportVideo() {
      return this._editor.exportVideo();
    },

    async exportTemplate() {
      return this._editor.exportTemplate();
    },

    loadTemplate(template: EditorTemplate, mode: "replace" | "reset") {
      this._editor.loadTemplate(template, mode);
    },

    onResetProgress() {
      this._editor.onResetProgress();
    },

    onChangeExportStatus(status: ExportProgress) {
      this._editor.onChangeExportStatus(status);
    },

    onChangeExportCodec(codec: string) {
      this._editor.onChangeExportCodec(codec);
    },

    onChangeExportFPS(fps: string) {
      this._editor.onChangeExportFPS(fps);
    },

    onChangeExportMode(mode: ExportMode) {
      this._editor.onChangeExportMode(mode);
    },

    onChangeFileName(name: string) {
      this._editor.onChangeFileName(name);
    },

    onChangeName(name: string) {
      this._editor.onChangeName(name);
    },

    setActiveSidebarLeft(sidebar: string | null) {
      this._editor.setActiveSidebarLeft(sidebar);
    },

    setActiveSidebarRight(sidebar: string | null) {
      this._editor.setActiveSidebarRight(sidebar);
    },

    getPageById(id: string){
      return this._editor.getPageById(id);
    },

    addPage(template?: EditorTemplate) {
      this._editor.addPage(template);
    },

    deleteActivePage() {
      this._editor.deleteActivePage();
    },

    deletePage(index: number) {
      this._editor.deletePage(index);
    },

    copyPage(index: number) {
      this._editor.copyPage(index);
    },

    swapPage(oldIndex: number, newIndex: number) {
      this._editor.swapPage(oldIndex, newIndex);
    },

    onChangeActivePage(index: number) {
      this._editor.onChangeActivePage(index);
    },

    onTogglePreviewModal(mode: "open" | "close") {
      this._editor.onTogglePreviewModal(mode);
    },

    onToggleMode(mode?: EditorMode) {
      this._editor.onToggleMode(mode);
    },

    onToggleTimeline(mode?: "open" | "close") {
      this._editor.onToggleTimeline(mode);
    },

    changeStatus(status: EditorStatus) {
      this._editor.changeStatus(status);
    },

    resize(dimensions: { width: number; height: number }, changeArtboards: boolean = false){
      this._editor.resize(dimensions, changeArtboards);
    },

    getCanvasInstance(page: number): fabric.Canvas {
      return this.pages[page]?.instance;
    }
  }
});
