import getMode from "../lib/tools/getMode";
import mergeDeep from "../lib/tools/merge";
import QRSVG from "../lib/core/QRSVG";
import defaultOptions, { RequiredOptions } from "../lib/core/QROptions";
import sanitizeOptions from "../lib/tools/sanitizeOptions";
import getMimeType from "../lib/tools/getMimeType";
import { FileExtension, QRCode as QRCodeInterface, Options, DownloadOptions } from "../lib/types";
import { ImageLoader } from "../lib/types/svg-descriptors";
import qrcode from "qrcode-generator";
import { serializeSvg } from "./svgSerializer";

export type NodeImageLoader = ImageLoader;

export default class QRCode {
  _options: RequiredOptions;
  _qr?: QRCodeInterface;
  _svgDrawingPromise?: Promise<void>;
  _qrSVG?: QRSVG;
  _imageLoader?: ImageLoader;

  constructor(options?: Partial<Options> & { imageLoader?: ImageLoader }) {
    this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options) as RequiredOptions) : defaultOptions;

    if (options?.imageLoader) {
      this._imageLoader = options.imageLoader;
    }

    this._generate();
  }

  _generate(): void {
    if (!this._options.data) {
      return;
    }

    this._qr = qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
    this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode(this._options.data));
    this._qr.make();

    this._qrSVG = new QRSVG(this._options);
    this._svgDrawingPromise = this._qrSVG.drawQR(this._qr, this._imageLoader);
  }

  update(options?: Partial<Options>): void {
    this._options = options ? sanitizeOptions(mergeDeep(this._options, options) as RequiredOptions) : this._options;
    this._generate();
  }

  async getSVG(): Promise<string> {
    if (!this._qr || !this._qrSVG) throw new Error("QR code is empty");

    await this._svgDrawingPromise;
    return serializeSvg(this._qrSVG.getDescriptor());
  }

  async getDataURI(format: FileExtension = "svg"): Promise<string> {
    if (format.toLowerCase() !== "svg") {
      throw new Error(`Format "${format}" requires a raster renderer. Use getSVG() or install @resvg/resvg-js for raster output.`);
    }

    const svgString = await this.getSVG();
    const base64 = Buffer.from(svgString).toString("base64");
    return `data:${getMimeType("svg")};base64,${base64}`;
  }

  async getBuffer(format: FileExtension = "svg"): Promise<Buffer> {
    if (format.toLowerCase() !== "svg") {
      throw new Error(`Format "${format}" requires a raster renderer. Use getBuffer("svg") or install @resvg/resvg-js for raster output.`);
    }

    const svgString = await this.getSVG();
    return Buffer.from(svgString);
  }

  async download(formatOrOptions?: FileExtension | Partial<DownloadOptions> | string): Promise<void> {
    let extension: FileExtension = "svg";
    let name = "qr-code";

    if (typeof formatOrOptions === "string") {
      extension = formatOrOptions as FileExtension;
    } else if (typeof formatOrOptions === "object" && formatOrOptions !== null) {
      if (formatOrOptions.name) name = formatOrOptions.name;
      if (formatOrOptions.extension) extension = formatOrOptions.extension;
    }

    const buffer = await this.getBuffer(extension);
    const fs = await import("fs");
    fs.writeFileSync(`${name}.${extension}`, buffer);
  }
}
