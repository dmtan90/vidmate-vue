// @ts-ignore
import { fabric } from "fabric";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import { FabricUtils } from "@/fabric/utils";
import { createInstance } from "@/lib/utils";
import { Canvas } from "@/plugins/canvas";
import type { EditorAudioElement } from "@/types/editor";
import { toast } from "vue-sonner";

export class CanvasAudio {
  private _canvas: Canvas;
  private context: AudioContext;

  private _gainEndOffset = 0;
  private _gainStartOffset = 2;

  elements: EditorAudioElement[];

  constructor(canvas: Canvas) {
    this._canvas = canvas;
    this.elements = [];
    this.context = createInstance(AudioContext);

    this._initEvents();
  }

  private get canvas() {
    return this._canvas.instance!;
  }

  private get selection() {
    return this._canvas.selection;
  }

  private get timeline() {
    return this._canvas.timeline;
  }

  private _timelineStartEvent() {
    this.play();
  }

  private _timelineStopEvent() {
    this.stop();
  }

  private _initEvents() {
    this.canvas.on("timeline:start", this._timelineStartEvent.bind(this));
    this.canvas.on("timeline:stop", this._timelineStopEvent.bind(this));
  }

  play() {
    for (const audio of this.elements) {
      if (audio.muted) continue;

      const gain = this.context.createGain();
      const source = this.context.createBufferSource();

      source.buffer = audio.buffer;
      gain.connect(this.context.destination);
      source.connect(gain);

      gain.gain.setValueAtTime(0, this.context.currentTime + audio.offset);
      gain.gain.linearRampToValueAtTime(audio.volume, this.context.currentTime + audio.offset + Math.min(this._gainStartOffset, audio.timeline / 2));
      gain.gain.linearRampToValueAtTime(0, this.context.currentTime + audio.offset + audio.timeline - this._gainEndOffset);

      audio.playing = true;
      audio.source = source;

      audio.source.start(this.context.currentTime + audio.offset, Math.max(this.timeline.seek / 1000, audio.trim), audio.timeline);
      audio.source.addEventListener("ended", () => (audio.playing = false));
    }
  }

  record(audios: EditorAudioElement[], context: OfflineAudioContext) {
    for (const audio of audios) {
      if (audio.muted) continue;

      const gain = context.createGain();
      const source = context.createBufferSource();

      source.buffer = audio.buffer;
      gain.connect(context.destination);
      source.connect(gain);

      gain.gain.setValueAtTime(0, context.currentTime + audio.offset);
      gain.gain.linearRampToValueAtTime(audio.volume, context.currentTime + audio.offset + Math.min(this._gainStartOffset, audio.timeline / 2));
      gain.gain.linearRampToValueAtTime(0, context.currentTime + audio.offset + audio.timeline - this._gainEndOffset);

      audio.source = source;
      source.start(context.currentTime + audio.offset, audio.trim, audio.timeline);
    }
  }

  stop(audios = this.elements) {
    for (const audio of audios) {
      if (!audio.playing) continue;
      audio.playing = false;
      audio.source.stop();
    }
  }

  get(id: string) {
    console.log("get", id, this.elements);
    const index = this.elements.findIndex((audio) => audio.id === id);
    if (index === -1) return null;

    const audio = this.elements[index];
    return audio;
  }

  getAudioVisual(id: string) : fabric.Object{
    const object = this.canvas.getItemByName(id);
    return object;
  }

  delete(id: string) {
    const index = this.elements.findIndex((audio) => audio.id === id);
    if (index === -1) return;

    const audio = this.elements[index];
    this.elements.splice(index, 1);

    //delete audio visual object
    const object = this.getAudioVisual(id);
    if(object){
      this._canvas.onDeleteObject(object);
    }

    if (this.selection.active?.name === audio.id) this.selection.active = null;
    if (this._canvas.trimmer.active?.object.name === audio.id) this._canvas.trimmer.active = null;
  }

  update(id: string, value: Partial<EditorAudioElement>) {
    const index = this.elements.findIndex((audio) => audio.id === id);
    const audio = this.elements[index];

    const updated = { ...audio, ...value };
    this.elements[index] = updated;

    //update audio visual object
    const object = this.getAudioVisual(id);
    if(object){
      this._canvas.onChangeAudioProperties(object, value);
    }
    // if (this.selection) this.selection.active = Object.assign({ type: "audio" }, updated) as unknown as fabric.Object;
  }

  async add(url: string, name: string, visual = true, _id?: string) {
    const response: Response = await fetch(url);
    const data: ArrayBuffer = await response.arrayBuffer();
    const buffer: AudioBuffer = await this.context.decodeAudioData(data);

    const id = _id || FabricUtils.elementID("audio");
    const duration = buffer.duration;
    const timeline = Math.min(duration, this.timeline.duration / 1000);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);

    const audio: EditorAudioElement = { id, buffer, url, timeline, name, duration, source, muted: false, playing: false, trim: 0, offset: 0, volume: 1 };
    this.elements.push(audio);

    //add visual audio object
    if(visual){
      this.addAudioVisual(audio);  
    }

    return audio;
  }

  addAudioVisual(audio: EditorAudioElement){
    this._canvas.onAddAudioFromElement(audio);
  }

  async initialize(audios: Omit<EditorAudioElement, "buffer" | "source">[]) {
    for (const audio of audios) {
      try {
        const response: Response = await fetch(audio.url);
        const data: ArrayBuffer = await response.arrayBuffer();
        const buffer: AudioBuffer = await this.context.decodeAudioData(data);

        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);

        const element: EditorAudioElement = Object.assign({ buffer, source }, audio);
        this.elements.push(element);
      } catch {
        toast.dismiss(audio.id);
        toast.error(`Ran into an error initializing audio - ${audio.name}`, { id: audio.id });
      }
    }
  }

  async extract(videos: fabric.Video[], { ffmpeg, signal }: { ffmpeg: FFmpeg; signal?: AbortSignal }) {
    if (!ffmpeg.loaded) throw createInstance(Error, "FFmpeg is not loaded");
    const result: EditorAudioElement[] = [];

    for (const video of videos) {
      if (!FabricUtils.isVideoElement(video) || !video.hasAudio) continue;
      signal?.throwIfAborted();

      const input = video.name!;
      const output = video.name! + ".wav";

      const file: Uint8Array = await fetchFile(video.getSrc());
      await ffmpeg.writeFile(input, file);
      await ffmpeg.exec(["-i", input, "-q:a", "0", "-map", "a", output], undefined, { signal });

      // @ts-expect-error
      const data: Uint8Array = await ffmpeg.readFile(output);
      const buffer: AudioBuffer = await this.context.decodeAudioData(data.buffer);

      const id = FabricUtils.elementID("audio");
      const duration = buffer.duration;

      const muted = video.muted();
      const volume = video.volume();

      const trim = video.trimStart / 1000;
      const offset = video.meta!.offset / 1000;
      const timeline = video.meta!.duration / 1000 - video.trimStart / 1000 - video.trimEnd / 1000;

      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      result.push({ id, buffer, duration, muted, volume, source, offset, timeline, trim, name: output, playing: false, url: "" });
    }

    return result;
  }
}
