import { checkForAudioInVideo } from "@/lib/media";
import { createInstance, createPromise, waitUntilEvent } from "@/lib/utils";
import { fabric } from "fabric";
import { clamp, isUndefined } from "lodash";
import type { EditorAudioElement } from "@/types/editor";
import { Bars, Circle, Line, Media, Waveform, useAVBars, 
useAVCircle, useAVLine, useAVMedia, useAVWaveform, VisualType, AudioVisual, VisualProps 
} from "audio-visual";
const FILL = 'fill';

class FabricAudio extends fabric.Object {
  private __visual!: AudioVisual;
  private __audioElement!: EditorAudioElement;
  private __renderer!: HTMLCanvasElement;

  public type = "audio";
  public visualProps = {} as VisualProps;

  get visualEnabled(){
    return this._audioElement.visualEnabled;
  }

  get visualType(){
    return this._audioElement.visualType;
  }

  get visualProps(){
    return this._audioElement.visualProps;
  }

  get src(){
    return this._audioElement.src;
  }

  set src(value){
    this._audioElement.src = src;
  }

  get buffer(){
    return this._audioElement.buffer;
  }

  set buffer(value){
    this._audioElement.buffer = value;
  }

  get duration(){
    return this._audioElement.duration;
  }

  get timeline(){
    return this._audioElement.timeline;
  }

  set timeline(value){
    this._audioElement.timeline = value;
  }

  get offset(){
    return this._audioElement.offset;
  }

  set offset(value){
    this._audioElement.offset = value;
  }

  get meta(){
    return { duration: this.timeline * 1000, offset: this.offset * 1000 };
  }

  set meta({duration, offset}){
    if(duration != undefined){
      this._audioElement.timeline = duration / 1000;
    }

    if(offset != undefined){
      this._audioElement.offset = offset / 1000;
    }
  }

  get trimStart(){
    return this.audioElement.trimStart;
  }

  set trimStart(value){
    this.audioElement.trimStart = value;
  }

  get trimEnd(){
    return this.audioElement.trimEnd;
  }

  set trimEnd(value){
    this.audioElement.trimEnd = value;
  }

  get audioElement() : EditorAudioElement{
    return this._audioElement;
  }

  set audioElement(element: EditorAudioElement){
    this._audioElement = element;
  }

  public muted(value?: boolean) {
    const element = this.audioElement;
    if (!element) return true;
    if (isUndefined(value)) return element.muted;
    element.muted = value;
    return value;
  },

  public volume(value?: number) {
    const element = this.audioElement;
    if (!element) return 0;
    if (isUndefined(value)) return element.volume;
    element.volume = value;
    return value;
  },

  public duration(trim?: boolean) {
    console.log("duration", trim);
    const element = this.audioElement;
    return element ? (trim ? element.duration - this.trimStart - this.trimEnd : element.duration) : 0;
  },

  public async play() {
    console.log("play");
    if (this.playing) return;
    this.playing = true;
    const element = this.audioElement;
    element.currentTime = this.trimStart;
    await element.play();
    console.log(element);
  },

  public pause() {
    if (!this.playing) return;
    this.playing = false;
    const element = this.audioElement;
    element.pause();
  },

  seek: async function (_seconds: number) {
    const element = this.audioElement;
    const seconds = _seconds + this.trimStart;
    element.currentTime = clamp(seconds, 0, this.duration(true));
    await waitUntilEvent(element, "seeked");
  },

  // update: function () {
  //   if (this.canvas) {
  //     const backend = fabric.filterBackend;
  //     if (backend?.evictCachesForKey) {
  //       backend.evictCachesForKey(this.cacheKey);
  //       backend.evictCachesForKey(this.cacheKey + "_filtered");
  //     }
  //     this.applyFilters();
  //     this.canvas.renderAll();
  //     fabric.util.requestAnimFrame(this.update.bind(this));
  //   }
  // },

  private __setVisualConfiguration(options: Partial<VisualProps>): FabricAudio {
    const instance = this.__visual;
    this.visualProps = merge({}, this.visualProps, options);
    if (instance) {
      if (options.type && options.type !== instance.type) {
        instance.destroy();
        this.__createVisual();
        return this;
      }
      instance.options = this.visualProps || instance.options;
      this.__visual.update();
    }
    return this;
  }

  private __setVisualSize() {
    const canvas = this.__visual.canvas!;
    canvas.width = this.getScaledWidth();
    canvas.height = this.getScaledHeight();
    this.__visual.resize(canvas.width, canvas.height);
  }

  // private __defaultVisualConfiguration() {
  //   return merge({}, chartConfiguration, {
  //     options: {
  //       onResize: (size: any) => {
  //         chartConfiguration.options?.onResize?.call(this.__visual, this.__visual, size);
  //         this.chart.options?.onResize?.call(this.__visual, this.__visual, size);
  //         this.dirty = true;
  //         this.canvas?.requestRenderAll();
  //       },
  //       animation: {
  //         onProgress: (event: AnimationEvent) => {
  //           if (chartConfiguration.options?.animation) chartConfiguration.options?.animation?.onProgress?.call(this.__visual, { ...event, chart: this.__visual });
  //           if (this.chart.options?.animation) this.chart.options?.animation?.onProgress?.call(this.__visual, { ...event, chart: this.__visual });
  //           this.dirty = true;
  //           this.canvas?.requestRenderAll();
  //         },
  //       },
  //     },
  //   });
  // }

  private __getVisualBoundingClientRect() {
    return {
      bottom: this.top! + this.getScaledHeight(),
      height: this.getScaledHeight(),
      left: this.left,
      right: this.left! + this.getScaledWidth(),
      top: this.top,
      width: this.getScaledWidth(),
      x: this.left! + this.getScaledWidth() / 2,
      y: this.top! + this.getScaledHeight() / 2,
    } as DOMRect;
  }

  private __getVisualCurrentStyle() {
    return {
      "padding-left": 0,
      "padding-right": 0,
      "padding-top": 0,
      "padding-bottom": 0,
    } as Partial<CSSStyleDeclaration>;
  }

  private __createVisualCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = this.getScaledWidth();
    canvas.height = this.getScaledHeight();
    canvas.style.backgroundColor = "#FFFFFF";
    Object.defineProperty(canvas, "clientWidth", { get: () => canvas.width / window.devicePixelRatio });
    Object.defineProperty(canvas, "clientHeight", { get: () => canvas.height / window.devicePixelRatio });
    Object.defineProperty(canvas, "getBoundingClientRect", { value: this.__getVisualBoundingClientRect.bind(this) });
    Object.defineProperty(canvas, "currentStyle", { value: this.__getVisualCurrentStyle() });
    return canvas;
  }

  // private __bindChartEvents() {
  //   for (const name in chartEvents) {
  //     const event = name as keyof typeof chartEvents;
  //     this.on(event, (e) => {
  //       if (this.canvas && this.__visual.canvas) {
  //         let { x, y } = this.toLocalPoint(this.canvas.getPointer(e.e) as fabric.Point, "left", "top");
  //         if (this.flipX) x = this.getScaledWidth() - x;
  //         if (this.flipY) y = this.getScaledHeight() - y;
  //         this.__visual.canvas!.dispatchEvent(createInstance(MouseEvent, chartEvents[event], { clientX: this.left! + x, clientY: this.top! + y }));
  //       }
  //     });
  //   }
  // }

  private __createVisual() {
    // const options = merge({}, this.visualProps, this.__defaultVisualConfiguration());
    this.__visual = createInstance(AudioVisual, this.__createVisualCanvas(), this.visualProps);
    return this.__visual;
  }

  private __createVisualRenderer() {
    this.__renderer = document.createElement("canvas");
  }

  private __renderWaveVisual() {
    this.__renderer.width = this.width! * window.devicePixelRatio;
    this.__renderer.height = this.height! * window.devicePixelRatio;
    const context = this.__renderer.getContext("2d")!;
    context.clearRect(0, 0, this.__renderer.width, this.__renderer.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, this.__renderer.width, this.__renderer.height);
    context.drawImage(this.__visual.canvas, 0, 0, this.__renderer.width, this.__renderer.height);
  }

  public initialize(element: EditorAudioElement, options?: fabric.IAudioOptions) {
    this._audioElement = element;
    super.initialize(options);
    this.__createVisual();
    // this.__bindChartEvents();
    this.__createVisualRenderer();
    this.on("modified", this.__setVisualSize.bind(this));
    return this;
  }

  public _set(key: string, value: any) {
    if (key === "visual") return this.__setVisualConfiguration(value);
    return super._set(key, value);
  }

  public _render(ctx: CanvasRenderingContext2D) {
    if (!this.__visual) return;
    this.__renderWaveVisual();
    ctx.drawImage(this.__renderer, -this.width! / 2, -this.height! / 2, this.width!, this.height!);
  }

  public static fromObject(element: EditorAudioElement, options: fabric.IAudioOptions, callback: Function) {
    return callback?.(createInstance(fabric.Audio, element, options));
  }
}

const AudioObject = fabric.util.createClass(FabricAudio, { type: "audio" });
FabricAudio.fromObject = FabricAudio.fromObject;
fabric.Audio = AudioObject;

// fabric.util.object.extend(fabric.util, {
//   chart: {
//     addPlugins(...plugins: any[]) {
//       chartPlugins.push(...plugins);
//     },
//     setDefaults(options: Partial<ChartConfiguration>) {
//       merge(chartConfiguration, options);
//     },
//   },
// });

// const Visual = fabric.util.createClass(fabric.Object, {
//   type: "visual",
//   audioElement: EditorAudioElement = null,

//   initialize: function (element: EditorAudioElement, options?: fabric.IAudioOptions) {
//     options = options || {};

//     // element.loop = false;
//     // element.currentTime = 0;
//     // element.muted = options.muted ?? false;
//     // element.crossOrigin = options.crossOrigin ?? null;

//     const canvas = document.createElement("canvas");
//     canvas.width = options.width ?? 50;
//     canvas.height = options.height ?? 50;

//     this.audioElement = element;
//     // this.visualEnabled = options.visualEnabled ?? true;
//     // this.visualType = options.visualType ?? VisualType.Circle;
//     // this.visualProps = options.visualProps ?? new Circle({canvWidth: canvas.width, canvHeight: canvas.height});
//     // this.visualProps.src = element.src;

//     this.callSuper("initialize", canvas, options);
//     this.set({ left: options.left ?? 0, top: options.top ?? 0, trimStart: options.trimStart ?? 0, trimEnd: options.trimEnd ?? 0, objectCaching: false });
//     this.initAudioVisual();
//     this.on("added", () => fabric.util.requestAnimFrame(this.update.bind(this)));

//     watch(this.audioElement, (value) => {
//       console.log("audioElement", this.audioElement);
//     });
//   },

//   get visualEnabled(){
//     return this.audioElement.visualEnabled;
//   }

//   get visualType(){
//     return this.audioElement.visualType;
//   }

//   get visualProps(){
//     return this.audioElement.visualProps;
//   }

//   get src(){
//     return this.audioElement.src;
//   }

//   set src(value){
//     this.audioElement.src = src;
//   }

//   get buffer(){
//     return this.audioElement.buffer;
//   }

//   set buffer(value){
//     this.audioElement.buffer = value;
//   }

//   get duration(){
//     return this.audioElement.duration;
//   }

//   get timeline(){
//     return this.audioElement.timeline;
//   }

//   set timeline(value){
//     this.audioElement.timeline = value;
//   }

//   get offset(){
//     return this.audioElement.offset;
//   }

//   set offset(value){
//     this.audioElement.offset = value;
//   }

//   get meta(){
//     return { duration: this.timeline * 1000, offset: this.offset * 1000 };
//   }

//   set meta({duration, offset}){
//     if(duration != undefined){
//       this.audioElement.timeline = duration / 1000;
//     }

//     if(offset != undefined){
//       this.audioElement.offset = offset / 1000;
//     }
//   }

//   initAudioVisual: function(){
//     if(this._init){
//       return;
//     }

//     let visualFn = useAVLine;
//     if(this.visualType == VisualType.Bars){
//       visualFn = useAVBars;
//     }
//     else if(this.visualType == VisualType.Circle){
//       visualFn = useAVCircle;
//     }
//     else if(this.visualType == VisualType.Line){
//       visualFn = useAVLine;
//     }
//     else if(this.visualType == VisualType.Media){
//       visualFn = useAVMedia;
//     }
//     else if(this.visualType == VisualType.Waveform){
//       visualFn = useAVWaveform;
//     }

//     if(this.visualEnabled){
//       visualFn(this.audioElement, this._originalElement, this.visualProps, () => {
//         console.log("visualFn => draw");
//       });

//     }
//     this._init = true;
//   },

//   muted: function (value?: boolean) {
//     const element = this.audioElement as HTMLAudioElement;
//     if (!element) return true;
//     if (isUndefined(value)) return element.muted;
//     element.muted = value;
//     return value;
//   },

//   volume: function (value?: number) {
//     const element = this.audioElement as HTMLAudioElement;
//     if (!element) return 0;
//     if (isUndefined(value)) return element.volume;
//     element.volume = value;
//     return value;
//   },

//   duration: function (trim?: boolean) {
//     console.log("duration", trim);
//     const element = this.audioElement as HTMLAudioElement;
//     return element ? (trim ? element.duration - this.trimStart - this.trimEnd : element.duration) : 0;
//   },

//   play: async function () {
//     console.log("play");
//     if (this.playing) return;
//     this.playing = true;
//     const element = this.audioElement as HTMLAudioElement;
//     element.currentTime = this.trimStart;
//     await element.play();
//     console.log(element);
//   },

//   pause: function () {
//     if (!this.playing) return;
//     this.playing = false;
//     const element = this.audioElement as HTMLAudioElement;
//     element.pause();
//   },

//   seek: async function (_seconds: number) {
//     const element = this.audioElement as HTMLAudioElement;
//     const seconds = _seconds + this.trimStart;
//     element.currentTime = clamp(seconds, 0, this.duration(true));
//     await waitUntilEvent(element, "seeked");
//   },

//   update: function () {
//     if (this.canvas) {
//       const backend = fabric.filterBackend;
//       if (backend?.evictCachesForKey) {
//         backend.evictCachesForKey(this.cacheKey);
//         backend.evictCachesForKey(this.cacheKey + "_filtered");
//       }
//       this.applyFilters();
//       this.canvas.renderAll();
//       fabric.util.requestAnimFrame(this.update.bind(this));
//     }
//   },

//   // _render(ctx: CanvasRenderingContext2D) {
//   //   this.callSuper("_render", ctx);
//   // },

//   /**
//    * Returns svg representation of an instance
//    * @return {string[]} an array of strings with the specific svg representation
//    * of the instance
//    */
//   // _toSVG() {
//   //   const imageMarkup: string[] = [],
//   //     element = this._element,
//   //     x = -this.width / 2,
//   //     y = -this.height / 2;
//   //   let svgString: string[] = [],
//   //     strokeSvg: string[] = [],
//   //     clipPath = '',
//   //     imageRendering = '';
//   //   if (!element) {
//   //     return [];
//   //   }
//   //   if (this.clipPath) {
//   //     const clipPathId = this.clipPath?.clipPathId ?? "crop_image_1";
//   //     svgString.push(
//   //       '<clipPath id="' + clipPathId + '">\n',
//   //       '\t<rect x="' +
//   //         x +
//   //         '" y="' +
//   //         y +
//   //         '" width="' +
//   //         this.width +
//   //         '" height="' +
//   //         this.height +
//   //         '" />\n',
//   //       '</clipPath>\n',
//   //     );
//   //     clipPath = ' clip-path="url(#' + clipPathId + ')" ';
//   //   }
//   //   if (!this.imageSmoothing) {
//   //     imageRendering = ' image-rendering="optimizeSpeed"';
//   //   }
//   //   imageMarkup.push(
//   //     '\t<image ',
//   //     'COMMON_PARTS',
//   //     `xlink:href="${this.getThumbnail()}" x="${x - this.cropX}" y="${
//   //       y - this.cropY
//   //       // we're essentially moving origin of transformation from top/left corner to the center of the shape
//   //       // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
//   //       // so that object's center aligns with container's left/top
//   //     }" width="${
//   //       element.width || (element as HTMLImageElement).naturalWidth
//   //     }" height="${
//   //       element.height || (element as HTMLImageElement).naturalHeight
//   //     }"${imageRendering}${clipPath}></image>\n`,
//   //   );

//   //   if (this.stroke || this.strokeDashArray) {
//   //     const origFill = this.fill;
//   //     this.fill = null;
//   //     strokeSvg = [
//   //       `\t<rect x="${x}" y="${y}" width="${this.width}" height="${
//   //         this.height
//   //       }" style="${this.getSvgStyles()}" />\n`,
//   //     ];
//   //     this.fill = origFill;
//   //   }
//   //   if (this.paintFirst !== FILL) {
//   //     svgString = svgString.concat(strokeSvg, imageMarkup);
//   //   } else {
//   //     svgString = svgString.concat(imageMarkup, strokeSvg);
//   //   }
//   //   return svgString;
//   // },

//   // getThumbnail(): string {
//   //   // console.log(this, this._element, this._originalElement);
//   //   let base64 = null;
//   //   if(this.clipPath){
//   //     const x = -this.width / 2;
//   //     const y = -this.height / 2;
//   //     base64 = this.toDataURL({
//   //       format: "png",  
//   //       withoutTransform: true,
//   //       left: 0,
//   //       top: 0,
//   //       width: this._stateProperties.width,
//   //       height: this._stateProperties.height
//   //     });
//   //   }
//   //   else{
//   //     base64 = this.toDataURL({ 
//   //       format: "png", 
//   //       withoutShadow: true, 
//   //       withoutTransform: true
//   //     });
//   //   }
    
//   //   return base64;
//   // },

//   // toDataURL: function(options) {
//   //   options || (options = { });
//   //   return fabric.util.toDataURL(this.toCanvasElement(options), options.format || 'png', options.quality || 1);
//   // },

//   // toCanvasElement: function(options) {
//   //   console.log("toCanvasElement", options);
//   //   options || (options = { });

//   //   var utils = fabric.util, origParams = utils.saveObjectTransform(this),
//   //       originalGroup = this.group,
//   //       originalShadow = this.shadow, abs = Math.abs,
//   //       multiplier = (options.multiplier || 1) * (options.enableRetinaScaling ? fabric.devicePixelRatio : 1);
//   //   delete this.group;
//   //   if (options.withoutTransform) {
//   //     utils.resetObjectTransform(this);
//   //   }
//   //   if (options.withoutShadow) {
//   //     this.shadow = null;
//   //   }

//   //   var el = fabric.util.createCanvasElement(),
//   //       // skip canvas zoom and calculate with setCoords now.
//   //       boundingRect = this.getBoundingRect(true, true),
//   //       shadow = this.shadow, scaling,
//   //       shadowOffset = { x: 0, y: 0 }, shadowBlur,
//   //       width, height;

//   //   if (shadow) {
//   //     shadowBlur = shadow.blur;
//   //     if (shadow.nonScaling) {
//   //       scaling = { scaleX: 1, scaleY: 1 };
//   //     }
//   //     else {
//   //       scaling = this.getObjectScaling();
//   //     }
//   //     // consider non scaling shadow.
//   //     shadowOffset.x = 2 * Math.round(abs(shadow.offsetX) + shadowBlur) * (abs(scaling.scaleX));
//   //     shadowOffset.y = 2 * Math.round(abs(shadow.offsetY) + shadowBlur) * (abs(scaling.scaleY));
//   //   }
//   //   width = boundingRect.width + shadowOffset.x;
//   //   height = boundingRect.height + shadowOffset.y;
//   //   // if the current width/height is not an integer
//   //   // we need to make it so.
//   //   el.width = Math.ceil(width);
//   //   el.height = Math.ceil(height);
//   //   var canvas = new fabric.StaticCanvas(el, {
//   //     enableRetinaScaling: false,
//   //     renderOnAddRemove: false,
//   //     skipOffscreen: false,
//   //   });
//   //   if (options.format === 'jpeg') {
//   //     canvas.backgroundColor = '#fff';
//   //   }
//   //   this.setPositionByOrigin(new fabric.Point(canvas.width / 2, canvas.height / 2), 'center', 'center');

//   //   var originalCanvas = this.canvas;
//   //   canvas.add(this);
//   //   var canvasEl = canvas.toCanvasElement(multiplier || 1, options);
//   //   this.shadow = originalShadow;
//   //   this.set('canvas', originalCanvas);
//   //   if (originalGroup) {
//   //     this.group = originalGroup;
//   //   }
//   //   this.set(origParams).setCoords();
//   //   // canvas.dispose will call image.dispose that will nullify the elements
//   //   // since this canvas is a simple element for the process, we remove references
//   //   // to objects in this way in order to avoid object trashing.
//   //   canvas._objects = [];
//   //   canvas.dispose();
//   //   canvas = null;

//   //   return canvasEl;
//   // },

//   dispose: function () {
//     this.callSuper("dispose");
//   }
// });

// Visual.fromObject = function (audioElement: EditorAudioElement, callback: (audio: fabric.Audio | null) => void, options?: fabric.IAudioOptions) {
//   callback(createInstance(Visual, audioElement, options));
//   // const element = document.createElement("audio");
//   // // console.log("fromURL", url);
//   // element.currentTime = 0;
//   // element.playsInline = true;
//   // // element.controls = true;
//   // element.crossOrigin = options?.crossOrigin ?? null;

//   // element.onloadeddata = async () => {
//   //   element.onloadeddata = null;
//   //   element.onerror = null;

//   //   element.height = 50;
//   //   element.width = 50;

//   //   const hasAudio = await checkForAudioInVideo(url);
//   //   if(hasAudio){
//   //     callback(createInstance(Audio, element, options));
//   //   }
//   //   else{
//   //     callback(null);
//   //   }
//   // };
//   // element.onerror = () => {
//   //   element.onloadeddata = null;
//   //   element.onerror = null;
//   //   callback(null);
//   // };

//   // element.src = url;
//   // element.load();
// };

// fabric.Visual = fabricAudio;
