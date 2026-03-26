export type SvgTag =
  | "svg"
  | "rect"
  | "circle"
  | "path"
  | "clipPath"
  | "defs"
  | "linearGradient"
  | "radialGradient"
  | "stop"
  | "image"
  | "g";

export type SvgElementDescriptor = {
  tag: SvgTag;
  attributes: Record<string, string>;
  children: SvgElementDescriptor[];
};

export type ImageLoader = (uri: string | number) => Promise<{ width: number; height: number; dataUri: string }>;
