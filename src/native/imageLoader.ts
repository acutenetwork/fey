import { Image } from "react-native";
import { ImageLoader } from "../types/svg-descriptors";

export const rnImageLoader: ImageLoader = (imageSource: string | number) => {
  return new Promise((resolve, reject) => {
    if (typeof imageSource === "number") {
      const resolved = Image.resolveAssetSource(imageSource);
      if (!resolved) {
        return reject("Could not resolve local image asset");
      }
      resolve({ width: resolved.width, height: resolved.height, dataUri: resolved.uri });
      return;
    }

    Image.getSize(
      imageSource,
      (width: number, height: number) => {
        resolve({ width, height, dataUri: imageSource });
      },
      (error: unknown) => {
        reject(error);
      }
    );
  });
};
