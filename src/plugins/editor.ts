import { markRaw, ref, computed } from "vue"
import { nanoid } from "nanoid";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import WebFont from "webfontloader";
import { checkForAudioInVideo } from "@/lib/media";

import { Canvas } from "./canvas";
import { Prompt } from "./prompt";
import { Recorder } from "./recorder";
import { fonts } from "@/constants/fonts";

import { convertBufferToWaveBlob } from "@/lib/media";
import { createInstance } from "@/lib/utils";
import { FabricUtils } from "@/fabric/utils";
import { propertiesToInclude } from "@/fabric/constants";
import { type EditorAudioElement, EditorTemplate, EditorTemplatePage } from "@/types/editor";
import { Adapter } from "./adapter";

export type ExportMode = "video" | "both";
export type EditorMode = "creator" | "adapter";
export type EditorStatus = "uninitialized" | "pending" | "complete" | "error";

export interface EditorProgress {
  capture: number;
  compile: number;
}

export enum ExportProgress {
  None = 0,
  Error = 1,
  Completed = 2,
  CaptureAudio = 3,
  CaptureVideo = 4,
  CompileVideo = 5,
}

export interface Dimension {
  width: number;
  height: number;
}

export class Editor {
  public id: string;
  public name: string;
  public mode: EditorMode;
  public dimension: Dimension;

  public page: number;
  public pages: Canvas[];
  public status: EditorStatus;

  public sidebarLeft: string | null;
  public sidebarRight: string | null;
  public timelineOpen: boolean;

  public blob?: Blob;
  public frame?: string;

  public file: string;
  public fps: string;
  public codec: string;

  public saving: boolean;
  public preview: boolean;

  public exports: ExportMode;
  public progress: EditorProgress;

  public prompter: Prompt;
  public recorder: Recorder;
  public adapter: Adapter;

  public ffmpeg: FFmpeg;
  public exporting: ExportProgress;
  public controller: AbortController;

  constructor() {
    this.page = 0;
    this.id = nanoid();

    this.mode = "creator";
    this.name = "Untitled Template";
    this.status = "uninitialized";
    this.dimension = {
        width: 1920,
        height: 1080
    };

    this.pages = [createInstance(Canvas, this)];
    this.controller = markRaw(createInstance(AbortController));

    this.adapter = markRaw(createInstance(Adapter));
    this.prompter = markRaw(createInstance(Prompt, this));
    this.recorder = markRaw(createInstance(Recorder, this));

    this.saving = false;
    this.preview = false;

    this.exporting = ExportProgress.None;
    this.ffmpeg = markRaw(createInstance(FFmpeg));
    this.progress = { capture: 0, compile: 0 };

    this.file = "";
    this.fps = "30";
    this.codec = "H.264";
    this.exports = "both";

    this.sidebarLeft = null;
    this.sidebarRight = null;
    this.timelineOpen = false;
  }

  get canvas() : Canvas {
    return this.pages[this.page];
  }

  _progressEvent({ progress, frame }: { progress: number; frame?: string }) {
    switch (this.exporting) {
      case ExportProgress.CaptureVideo:
        this.progress.capture = progress * 100;
        if (frame) this.frame = frame;
        break;
      case ExportProgress.CompileVideo:
        this.progress.compile = progress * 100;
        break;
    }
  }

  async initialize(mode?: EditorMode) {
    // console.log("initialize", mode);
    if (mode) this.mode = mode;
    this.status = "pending";
    try {
      await this.ffmpeg.load({
        coreURL: await toBlobURL("https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm", "application/wasm"),
      });
      this.ffmpeg.on("progress", this._progressEvent.bind(this));
      // this.status = "complete";
      //load custom font before starting
      let fontFamilies = [];
      fonts.forEach(font => {
        fontFamilies.push(font.family);
      });
      WebFont.load({
        google: { families: fontFamilies },
        fontloading: (family) => {
          // console.debug("Loading font " + family);
        },
        active: () => {
          // console.debug("Fonts loaded!");
          this.status = "complete";
        },
      });
    } catch (error) {
      this.status = "error";
    }
  }

  async exportAudio() : Promise<Blob> {
    if (this.exports === "video") return null;
    this.controller = createInstance(AbortController);
    let combined : EditorAudioElement[] = [];
    let offsetMs = 0;
    for(let i = 0; i < this.pages.length; i++){
      const canvas = this.pages[i];
      const timeline = canvas.timeline;

      const audios = canvas.audio.elements.filter((audio) => !audio.muted && !!audio.volume);
      const videos = canvas.instance._objects.filter(FabricUtils.isVideoElement) as fabric.Video[];
      audios.forEach(audio => {
        if(audio){
          audio.offset += offsetMs/1000;
        }
      })

      const tracks: EditorAudioElement[] = await canvas.audio.extract(videos, { ffmpeg: this.ffmpeg, signal: this.controller.signal });
      tracks.forEach(track => {
        if(track){
          track.offset += offsetMs/1000;
        }
      });
      
      if(audios.length > 0 || tracks.length > 0){
        combined = combined.concat(audios, tracks);
      }
      offsetMs += timeline.duration;
    }

    // console.log(combined);
    if (!combined.length) return null;

    const sampleRate = combined[0].buffer.sampleRate;
    // const duration = combined.reduce((duration, audio) => (audio.timeline + audio.offset > duration ? audio.timeline + audio.offset : duration), 0);
    // const length = Math.min(duration, offsetMs / 1000) * sampleRate;
    const length = (offsetMs / 1000) * sampleRate;
    // console.log(combined, offsetMs, sampleRate, length);

    const context = createInstance(OfflineAudioContext, 2, length, sampleRate);
    this.canvas.audio.record(combined, context);
    const handler = () => this.canvas.audio.stop(audios);
    this.controller.signal.addEventListener("abort", handler);

    const buffer: AudioBuffer = await context.startRendering();
    this.controller.signal.throwIfAborted();
    this.controller.signal.removeEventListener("abort", handler);
    const blob = convertBufferToWaveBlob(buffer, buffer.length);

    return blob;
  }

  async exportVideo() : Promise<Blob> {
    this.blob = undefined;
    this.frame = undefined;
    this.onResetProgress();

    try {
      this.onChangeExportStatus(ExportProgress.CaptureAudio);
      const audio: Blob = await this.exportAudio();
      this.controller = createInstance(AbortController);
      await this.recorder.start();
      this.onChangeExportStatus(ExportProgress.CaptureVideo);
      const frames: Uint8Array[] = await this.recorder.capture(+this.fps, { signal: this.controller.signal, progress: this._progressEvent.bind(this) });
      this.recorder.stop();
      this.onChangeExportStatus(ExportProgress.CompileVideo);
      const blob: Blob = await this.recorder.compile(frames, { ffmpeg: this.ffmpeg, codec: this.codec, fps: this.fps, signal: this.controller.signal, audio });
      this.onChangeExportStatus(ExportProgress.Completed);
      this.blob = blob;
      return blob;
    } catch (error) {
      this.onChangeExportStatus(ExportProgress.Error);
      this.recorder.stop();
      throw error;
    }
  }

  async exportTemplate() : Promise<EditorTemplatePage[]> {
    // console.log("exportTemplate");
    const templates: EditorTemplatePage[] = [];
    for (const page of this.pages) {
      const thumbnail: string = await this.recorder.screenshot(page.instance);
      const scene = JSON.stringify(page.instance.toDatalessJSON(propertiesToInclude));
      const audios: Omit<EditorAudioElement, "buffer" | "source">[] = page.audio.elements.map(({ buffer, source, ...audio }) => audio);
      const data = { fill: page.workspace.fill, height: page.workspace.height, width: page.workspace.width, audios: audios, scene: scene };
      templates.push({ thumbnail: thumbnail, data: data, id: page.id, name: page.name, duration: page.timeline.duration });
    }
    return templates;
  }

  loadTemplate(template: EditorTemplate, mode: "replace" | "reset") {
    switch (mode) {
      case "reset":
        this.id = template.id;
        this.name = template.name;
        for (let index = 0; index < template.pages.length; index++) {
          const page = template.pages[index];
          const initialized = !!this.pages[index];
          if (!initialized) this.pages[index] = createInstance(Canvas, this);
          this.pages[index].template.set(page);
          if (initialized) this.pages[index].template.load();
        }
        if (this.pages.length <= template.pages.length) return;
        for (let index = template.pages.length; index < this.pages.length; index++) this.pages[index].destroy();
        this.pages.splice(template.pages.length);
        break;
      case "replace":
        for (let index = 0; index < template.pages.length; index++) {
          const offset = index + this.page;
          const page = template.pages[index];
          const initialized = !!this.pages[offset];
          if (!initialized) this.pages[offset] = createInstance(Canvas, this);
          this.pages[offset].template.set(page);
          if (initialized) this.pages[offset].template.load();
        }
        break;
    }
  }

  onResetProgress() {
    this.progress = { capture: 0, compile: 0 };
  }

  onChangeExportStatus(status: ExportProgress) {
    this.exporting = status;
  }

  onChangeExportCodec(codec: string) {
    this.codec = codec;
  }

  onChangeExportFPS(fps: string) {
    this.fps = fps;
  }

  onChangeExportMode(mode: ExportMode) {
    this.exports = mode;
  }

  onChangeFileName(name: string) {
    this.file = name;
  }

  onChangeName(name: string) {
    this.name = name;
  }

  setActiveSidebarLeft(sidebar: string | null) {
    this.sidebarLeft = sidebar;
  }

  setActiveSidebarRight(sidebar: string | null) {
    this.sidebarRight = sidebar;
  }

  addPage(template?: EditorTemplate) {
    const canvas = createInstance(Canvas, this);
    if(template){
      canvas.template?.set(template);
    }
    this.pages.push(canvas);
    this.onChangeActivePage(this.pages.length - 1);
  }

  deleteActivePage() {
    const length = this.pages.length;
    if (length > 1) {
      this.pages[this.page].destroy();
      this.pages.splice(this.page, 1);
      if (this.page >= length - 1) this.page = this.page - 1;
    }
  }

  deletePage(index: number) {
    const length = this.pages.length;
    if(index < length){
      this.pages[index].destroy();
      this.pages.splice(index, 1);
      if (index >= length - 1) this.page = this.page - 1;
    }
  }

  copyPage(index: number) {
    const length = this.pages.length;
    if(index < length){
      // this.pages[index].destroy();

      // this.pages.splice(index, 1);
      // if (index >= length - 1) this.page = this.page - 1;
    }
  }

  swapPage(oldIndex: number, newIndex: number) {
    const tmp = this.pages[newIndex];
    this.pages[newIndex] = this.pages[oldIndex];
    this.pages[oldIndex] = tmp;
    this.onChangeActivePage(newIndex);
  }

  onChangeActivePage(index: number) {
    this.page = index;
  }

  onTogglePreviewModal(mode: "open" | "close") {
    switch (mode) {
      case "open":
        this.preview = true;
        break;
      case "close":
        this.preview = false;
        if (this.exporting > 2) this.controller.abort({ message: "Export process cancelled by user" });
        break;
    }
  }

  onToggleMode(mode?: EditorMode) {
    switch (mode) {
      case "adapter":
        this.mode = "adapter";
        break;
      case "creator":
        this.mode = "creator";
        break;
      default:
        this.mode = this.mode === "creator" ? "adapter" : "creator";
        break;
    }
  }

  onToggleTimeline(mode?: "open" | "close") {
    switch (mode) {
      case "close":
        this.timelineOpen = false;
        break;
      case "open":
        this.timelineOpen = true;
        break;
      default:
        this.timelineOpen = !this.timelineOpen;
        break;
    }
  }

  changeStatus(status: EditorStatus) {
    this.status = status;
  }

  resizeArtboards(dimension: { width: number; height: number }) {
    this.dimension = dimension;
    this.pages.forEach(page => {
      page.workspace.resizeArtboard(dimension);
    });
  }
}
