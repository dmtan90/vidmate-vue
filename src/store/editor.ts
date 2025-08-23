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
    instance: createInstance(Editor) as Editor,
  }),

  getters: {
    page(state) : number {
      return this.instance.page;
    },
    id(state) : string {
      return this.instance.id;
    },
    mode(state){
      return this.instance.mode;
    },
    name(state) : string {
      return this.instance.name;
    },
    status(state){
      return this.instance.status;
    },
    pages(state) : Canvas[] {
      return this.instance.pages as Canvas[];
    },
    controller(state){
      return this.instance.controller;
    },
    adapter(state){
      return this.instance.adapter;
    },
    prompter(state){
      return this.instance.prompter;
    },
    recorder(state){
      return this.instance.recorder;
    },
    saving(state){
      return this.instance.saving;
    },
    preview(state){
      return this.instance.preview;
    },
    exporting(state){
      return this.instance.exporting;
    },
    ffmpeg(state){
      return this.instance.ffmpeg;
    },
    progress(state){
      return this.instance.progress;
    },
    blob(state){
      return this.instance.blob;
    },
    frame(state){
      return this.instance.frame;
    },
    file(state){
      return this.instance.file;
    },
    fps(state){
      return this.instance.fps;
    },
    codec(state){
      return this.instance.codec;
    },
    exports(state){
      return this.instance.exports;
    },
    sidebarLeft(state){
      return this.instance.sidebarLeft;
    },
    sidebarRight(state){
      return this.instance.sidebarRight;
    },
    timelineOpen(state){
      return this.instance.timelineOpen;
    },
    canvas(state) : Canvas {
      return this.instance?.canvas as Canvas;
    },
    dimension() {
      return this.instance?.dimension;
    }
  },

  actions: {
    _progressEvent({ progress, frame }: { progress: number; frame?: string }) {
      this.instance._progressEvent({ progress, frame });
    },

    async initialize(mode?: EditorMode) {
      this.instance.initialize(mode);
    },

    async exportAudio() {
      return this.instance.exportAudio();
    },

    async exportVideo() {
      return this.instance.exportVideo();
    },

    async exportTemplate() {
      return this.instance.exportTemplate();
    },

    loadTemplate(template: EditorTemplate, mode: "replace" | "reset") {
      this.instance.loadTemplate(template, mode);
    },

    onResetProgress() {
      this.instance.onResetProgress();
    },

    onChangeExportStatus(status: ExportProgress) {
      this.instance.onChangeExportStatus(status);
    },

    onChangeExportCodec(codec: string) {
      this.instance.onChangeExportCodec(codec);
    },

    onChangeExportFPS(fps: string) {
      this.instance.onChangeExportFPS(fps);
    },

    onChangeExportMode(mode: ExportMode) {
      this.instance.onChangeExportMode(mode);
    },

    onChangeFileName(name: string) {
      this.instance.onChangeFileName(name);
    },

    onChangeName(name: string) {
      this.instance.onChangeName(name);
    },

    setActiveSidebarLeft(sidebar: string | null) {
      this.instance.setActiveSidebarLeft(sidebar);
    },

    setActiveSidebarRight(sidebar: string | null) {
      this.instance.setActiveSidebarRight(sidebar);
    },

    addPage(template?: EditorTemplate) {
      this.instance.addPage(template);
    },

    deleteActivePage() {
      this.instance.deleteActivePage();
    },

    deletePage(index: number) {
      this.instance.deletePage(index);
    },

    clonePage(index: number) {
      this.instance.clonePage(index);
    },

    swapPage(oldIndex: number, newIndex: number) {
      this.instance.swapPage(oldIndex, newIndex);
    },

    onChangeActivePage(index: number) {
      this.instance.onChangeActivePage(index);
    },

    onTogglePreviewModal(mode: "open" | "close") {
      this.instance.onTogglePreviewModal(mode);
    },

    onToggleMode(mode?: EditorMode) {
      this.instance.onToggleMode(mode);
    },

    onToggleTimeline(mode?: "open" | "close") {
      this.instance.onToggleTimeline(mode);
    },

    changeStatus(status: EditorStatus) {
      this.instance.changeStatus(status);
    },

    resizeArtboards(dimensions: { width: number; height: number }){
      this.instance.resizeArtboards(dimensions);
    },

    getCanvasInstance(page: number): fabric.Canvas {
      return this.pages[page]?.instance;
    }
  }
});
