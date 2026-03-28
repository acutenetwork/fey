import { ImageLoader } from "../lib/types/svg-descriptors";
import toDataUrl from "../lib/tools/toDataUrl";
import { Window } from "../lib/types";

export function createWebImageLoader(window: Window, crossOrigin?: string, saveAsBlob?: boolean): ImageLoader {
  return (uri: string | number) => {
    if (typeof uri !== "string") return Promise.reject("Web image loader only supports string URIs");
    return new Promise((resolve, reject) => {
      const image = new window.Image();

      if (typeof crossOrigin === "string") {
        image.crossOrigin = crossOrigin;
      }

      image.onload = async () => {
        let dataUri = uri;
        if (saveAsBlob) {
          dataUri = await toDataUrl(uri, window);
        }
        resolve({ width: image.width, height: image.height, dataUri });
      };

      image.onerror = reject;
      image.src = uri;
    });
  };
}

export function createNodeImageLoader(
  nodeCanvas: {
    loadImage: (src: string) => Promise<{ width: number; height: number }>;
    createCanvas: (
      w: number,
      h: number
    ) => {
      getContext: (type: string) => { drawImage: (img: unknown, x: number, y: number) => void } | null;
      toDataURL: () => string;
    };
  },
  saveAsBlob?: boolean
): ImageLoader {
  return (uri: string | number) => {
    if (typeof uri !== "string") return Promise.reject("Node image loader only supports string URIs");
    return nodeCanvas.loadImage(uri).then((image: { width: number; height: number }) => {
      let dataUri = uri;
      if (saveAsBlob) {
        const canvas = nodeCanvas.createCanvas(image.width, image.height);
        canvas.getContext("2d")?.drawImage(image, 0, 0);
        dataUri = canvas.toDataURL();
      }
      return { width: image.width, height: image.height, dataUri };
    });
  };
}
