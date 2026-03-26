import { useRef, useEffect } from "react";
import QRCodeCore from "../lib/core/QRCode";
import type { Options } from "../lib/types";

export function useQRCode(options: Partial<Options>) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeCore | null>(null);
  const optionsJson = JSON.stringify(options);

  useEffect(() => {
    if (!ref.current) return;

    if (!qrRef.current) {
      qrRef.current = new QRCodeCore(options);
      qrRef.current.append(ref.current);
    } else {
      qrRef.current.update(options);
    }
  }, [optionsJson]);

  return { ref, qrCode: qrRef };
}
