import getMode from "../tools/getMode";
import mergeDeep from "../tools/merge";
import downloadURI from "../tools/downloadURI";
import QRSVG from "./QRSVG";
import drawTypes from "../constants/drawTypes";

import defaultOptions, { RequiredOptions } from "./QROptions";
import sanitizeOptions from "../tools/sanitizeOptions";
import { FileExtension, QRCode as QRCodeInterface, Options, DownloadOptions, ExtensionFunction, Window } from "../types";
import { ImageLoader } from "../types/svg-descriptors";
import qrcode from "qrcode-generator";
import getMimeType from "../tools/getMimeType";
import { renderToDOM } from "../renderers/web/domRenderer";
import { createWebImageLoader, createNodeImageLoader } from "../renderers/web/webImageLoader";

declare const window: Window;

export default class QRCode {
  _options: RequiredOptions;
  _window: Window;
  _container?: HTMLElement;
  _domCanvas?: HTMLCanvasElement;
  _nodeCanvas?: unknown;
  _svg?: SVGElement;
  _qr?: QRCodeInterface;
  _extension?: ExtensionFunction;
  _canvasDrawingPromise?: Promise<void>;
  _svgDrawingPromise?: Promise<void>;
  _imageLoader?: ImageLoader;

  constructor(options?: Partial<Options>) {
    if (options?.jsdom) {
      this._window = new options.jsdom("", { resources: "usable" }).window;
    } else {
      this._window = window;
    }
    this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options) as RequiredOptions) : defaultOptions;

    if (this._options.nodeCanvas?.loadImage) {
      this._imageLoader = createNodeImageLoader(
        this._options.nodeCanvas as Parameters<typeof createNodeImageLoader>[0],
        this._options.imageOptions.saveAsBlob
      );
    } else {
      this._imageLoader = createWebImageLoader(
        this._window,
        this._options.imageOptions.crossOrigin,
        this._options.imageOptions.saveAsBlob
      );
    }

    this.update();
  }

  static _clearContainer(container?: HTMLElement): void {
    if (container) {
      container.innerHTML = "";
    }
  }

  _setupSvg(): void {
    if (!this._qr) {
      return;
    }
    const qrSVG = new QRSVG(this._options);

    const rootDesc = qrSVG.getDescriptor();
    const svg = this._window.document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGElement;
    for (const [key, value] of Object.entries(rootDesc.attributes)) {
      svg.setAttribute(key, value);
    }
    this._svg = svg;

    this._svgDrawingPromise = qrSVG.drawQR(this._qr, this._imageLoader).then(() => {
      if (!this._svg) return;
      const descriptor = qrSVG.getDescriptor();
      for (const child of descriptor.children) {
        this._svg.appendChild(renderToDOM(child, this._window.document));
      }
      this._extension?.(this._svg, this._options);
    });
  }

  _setupCanvas(): void {
    if (!this._qr) {
      return;
    }

    if (this._options.nodeCanvas?.createCanvas) {
      this._nodeCanvas = this._options.nodeCanvas.createCanvas(this._options.width, this._options.height);
      (this._nodeCanvas as HTMLCanvasElement).width = this._options.width;
      (this._nodeCanvas as HTMLCanvasElement).height = this._options.height;
    } else {
      this._domCanvas = document.createElement("canvas");
      this._domCanvas.width = this._options.width;
      this._domCanvas.height = this._options.height;
    }

    this._setupSvg();
    this._canvasDrawingPromise = this._svgDrawingPromise?.then(() => {
      if (!this._svg) return;

      const svg = this._svg;
      const xml = new this._window.XMLSerializer().serializeToString(svg);
      const svg64 = btoa(xml);
      const image64 = `data:${getMimeType("svg")};base64,${svg64}`;

      if (this._options.nodeCanvas?.loadImage) {
        return this._options.nodeCanvas.loadImage(image64).then((image: { width: number; height: number }) => {
          image.width = this._options.width;
          image.height = this._options.height;
          (this._nodeCanvas as HTMLCanvasElement)?.getContext("2d")?.drawImage(image as CanvasImageSource, 0, 0);
        });
      } else {
        const image = new this._window.Image();

        return new Promise((resolve) => {
          image.onload = (): void => {
            this._domCanvas?.getContext("2d")?.drawImage(image, 0, 0);
            resolve();
          };

          image.src = image64;
        });
      }
    });
  }

  async _getElement(extension: FileExtension = "png") {
    if (!this._qr) throw "QR code is empty";

    if (extension.toLowerCase() === "svg") {
      if (!this._svg || !this._svgDrawingPromise) {
        this._setupSvg();
      }
      await this._svgDrawingPromise;
      return this._svg;
    } else {
      if (!(this._domCanvas || this._nodeCanvas) || !this._canvasDrawingPromise) {
        this._setupCanvas();
      }
      await this._canvasDrawingPromise;
      return this._domCanvas || this._nodeCanvas;
    }
  }

  update(options?: Partial<Options>): void {
    QRCode._clearContainer(this._container);
    this._options = options ? sanitizeOptions(mergeDeep(this._options, options) as RequiredOptions) : this._options;

    if (!this._options.data) {
      return;
    }

    this._qr = qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
    this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode(this._options.data));
    this._qr.make();

    if (this._options.type === drawTypes.canvas) {
      this._setupCanvas();
    } else {
      this._setupSvg();
    }

    this.append(this._container);
  }

  append(container?: HTMLElement): void {
    if (!container) {
      return;
    }

    if (typeof container.appendChild !== "function") {
      throw "Container should be a single DOM node";
    }

    if (this._options.type === drawTypes.canvas) {
      if (this._domCanvas) {
        container.appendChild(this._domCanvas);
      }
    } else {
      if (this._svg) {
        container.appendChild(this._svg);
      }
    }

    this._container = container;
  }

  applyExtension(extension: ExtensionFunction): void {
    if (!extension) {
      throw "Extension function should be defined.";
    }

    this._extension = extension;
    this.update();
  }

  deleteExtension(): void {
    this._extension = undefined;
    this.update();
  }

  // ── New convenience methods ──

  async getSVG(): Promise<string> {
    if (!this._qr) throw "QR code is empty";

    if (!this._svg || !this._svgDrawingPromise) {
      this._setupSvg();
    }
    await this._svgDrawingPromise;

    if (!this._svg) throw "SVG element is not available";

    const serializer = new this._window.XMLSerializer();
    const source = serializer.serializeToString(this._svg);
    return `<?xml version="1.0" standalone="no"?>\r\n${source}`;
  }

  async getDataURI(format: FileExtension = "png"): Promise<string> {
    if (!this._qr) throw "QR code is empty";

    if (format.toLowerCase() === "svg") {
      const svgString = await this.getSVG();
      const base64 = btoa(unescape(encodeURIComponent(svgString)));
      return `data:${getMimeType("svg")};base64,${base64}`;
    }

    const element = await this._getElement(format);
    if (!element) throw "Canvas element is not available";

    const mimeType = getMimeType(format);

    if ("toDataURL" in (element as object)) {
      return (element as HTMLCanvasElement).toDataURL(mimeType, 1);
    }

    throw "Cannot generate data URI in this environment";
  }

  async getBlob(format: FileExtension = "png"): Promise<Blob> {
    if (!this._qr) throw "QR code is empty";
    if (typeof Blob === "undefined") throw "Blob is not available in this environment";

    if (format.toLowerCase() === "svg") {
      const svgString = await this.getSVG();
      return new Blob([svgString], { type: getMimeType("svg") });
    }

    const element = await this._getElement(format);
    if (!element) throw "Canvas element is not available";

    const mimeType = getMimeType(format);

    return new Promise((resolve, reject) => {
      if ("toBlob" in (element as object)) {
        (element as HTMLCanvasElement).toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Failed to create blob");
          },
          mimeType,
          1
        );
      } else {
        reject("toBlob is not available in this environment");
      }
    });
  }

  async getBuffer(format: FileExtension = "png"): Promise<Buffer> {
    if (!this._qr) throw "QR code is empty";

    if (format.toLowerCase() === "svg") {
      const svgString = await this.getSVG();
      return Buffer.from(svgString);
    }

    const element = await this._getElement(format);
    if (!element) throw "Canvas element is not available";

    const mimeType = getMimeType(format);

    if ("toBuffer" in (element as object)) {
      return (element as { toBuffer: (mime: string) => Buffer }).toBuffer(mimeType);
    }

    throw "toBuffer is not available — this method is for Node.js with node-canvas";
  }

  async download(formatOrOptions?: FileExtension | Partial<DownloadOptions> | string): Promise<void> {
    if (!this._qr) throw "QR code is empty";
    if (typeof Blob === "undefined") throw "Cannot download in Node.js, use getSVG/getBuffer instead.";

    let extension: FileExtension = "png";
    let name = "qr-code";

    if (typeof formatOrOptions === "string") {
      // Shorthand: qr.download("svg") or qr.download("png")
      extension = formatOrOptions as FileExtension;
    } else if (typeof formatOrOptions === "object" && formatOrOptions !== null) {
      if (formatOrOptions.name) {
        name = formatOrOptions.name;
      }
      if (formatOrOptions.extension) {
        extension = formatOrOptions.extension;
      }
    }

    const element = await this._getElement(extension);

    if (!element) {
      return;
    }

    if (extension.toLowerCase() === "svg") {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(element as SVGElement);
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      const url = `data:${getMimeType(extension)};charset=utf-8,${encodeURIComponent(source)}`;
      downloadURI(url, `${name}.svg`);
    } else {
      const url = (element as HTMLCanvasElement).toDataURL(getMimeType(extension));
      downloadURI(url, `${name}.${extension}`);
    }
  }
}
