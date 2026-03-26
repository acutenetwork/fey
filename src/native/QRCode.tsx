import React, { useEffect, useState, useRef, useCallback } from "react";
import Svg from "react-native-svg";
import QRSVG from "../core/QRSVG";
import defaultOptions, { RequiredOptions } from "../core/QROptions";
import sanitizeOptions from "../tools/sanitizeOptions";
import mergeDeep from "../tools/merge";
import getMode from "../tools/getMode";
import { Options } from "../types";
import { SvgElementDescriptor } from "../types/svg-descriptors";
import { rnImageLoader } from "./imageLoader";
import { renderToReactNativeSvg } from "./renderer";
import { exportToBase64 } from "./export";
import qrcode from "qrcode-generator";

export type QRCodeProps = Partial<Options> & {
  onReady?: (helpers: { toDataURL: () => Promise<string> }) => void;
};

export function QRCode({ onReady, ...optionsInput }: QRCodeProps): React.ReactElement | null {
  const [descriptor, setDescriptor] = useState<SvgElementDescriptor | null>(null);
  const svgRef = useRef<Svg>(null);

  const stableOptions = JSON.stringify(optionsInput);

  useEffect(() => {
    const parsed: Partial<Options> = JSON.parse(stableOptions);
    const mergedOptions = sanitizeOptions(mergeDeep(defaultOptions, parsed) as RequiredOptions);

    if (!mergedOptions.data) {
      setDescriptor(null);
      return;
    }

    const qr = qrcode(mergedOptions.qrOptions.typeNumber, mergedOptions.qrOptions.errorCorrectionLevel);
    qr.addData(mergedOptions.data, mergedOptions.qrOptions.mode || getMode(mergedOptions.data));
    qr.make();

    const builder = new QRSVG(mergedOptions);
    const imageLoader = mergedOptions.image ? rnImageLoader : undefined;

    builder
      .drawQR(qr, imageLoader)
      .then(() => {
        setDescriptor(builder.getDescriptor());
      })
      .catch((err) => {
        console.warn("QRCode: image failed to load, rendering without image.", err);
        const fallbackBuilder = new QRSVG({ ...mergedOptions, image: undefined });
        fallbackBuilder.drawQR(qr).then(() => {
          setDescriptor(fallbackBuilder.getDescriptor());
        });
      });
  }, [stableOptions]);

  const handleReady = useCallback(() => {
    if (onReady && svgRef.current) {
      onReady({
        toDataURL: () => exportToBase64(svgRef)
      });
    }
  }, [onReady]);

  useEffect(() => {
    if (descriptor) {
      const timer = setTimeout(handleReady, 50);
      return () => clearTimeout(timer);
    }
  }, [descriptor, handleReady]);

  if (!descriptor) return null;

  return renderToReactNativeSvg(descriptor, svgRef);
}
