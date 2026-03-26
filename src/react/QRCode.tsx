import React from "react";
import { useQRCode } from "./useQRCode";
import type { Options } from "../lib/types";

export type QRCodeProps = Partial<Options> & {
  className?: string;
  style?: React.CSSProperties;
};

export function QRCode({ className, style, ...options }: QRCodeProps) {
  const { ref } = useQRCode(options);
  return <div ref={ref} className={className} style={style} />;
}
