# @acutenetwork/fey

Beautiful, customizable QR codes for every platform. Generate styled QR codes with custom shapes, colors, gradients, and embedded logos — in the browser, Node.js, React, and React Native.

## Install

```bash
pnpm add @acutenetwork/fey
```

```bash
npm install @acutenetwork/fey
```

## Platform Entries

| Entry | Import | Environment |
|-------|--------|-------------|
| `@acutenetwork/fey` | Browser, vanilla JS | Browser (DOM) |
| `@acutenetwork/fey/node` | Node.js | Server (zero native deps) |
| `@acutenetwork/fey/react` | React component + hook | Browser (React 18+) |
| `@acutenetwork/fey/native` | React Native component | iOS / Android |

---

## Browser / Vanilla JS

```ts
import { QRCode } from "@acutenetwork/fey";

const qr = new QRCode({
  data: "https://example.com",
  width: 256,
  height: 256,
  dotsOptions: {
    type: "rounded",
    color: "#4267b2",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
});

// Render into a DOM element
qr.append(document.getElementById("qr-container")!);

// Export
const svg = await qr.getSVG();
const dataUri = await qr.getDataURI("png");
const blob = await qr.getBlob("png");

// Download to user's device
await qr.download("svg");
await qr.download({ name: "my-qr", extension: "png" });
```

### Browser API

```ts
class QRCode {
  constructor(options?: Partial<Options>);

  // Render
  append(container: HTMLElement): void;
  update(options?: Partial<Options>): void;

  // Export
  getSVG(): Promise<string>;
  getDataURI(format?: FileExtension): Promise<string>;
  getBlob(format?: FileExtension): Promise<Blob>;
  getBuffer(format?: FileExtension): Promise<Buffer>;

  // Download
  download(format: FileExtension): Promise<void>;
  download(options: { name?: string; extension?: FileExtension }): Promise<void>;

  // Extension
  applyExtension(fn: (svg: SVGElement, options: Options) => void): void;
  deleteExtension(): void;
}
```

---

## Node.js

Zero native dependencies. No jsdom, no canvas — pure SVG generation.

```ts
import { QRCode } from "@acutenetwork/fey/node";

const qr = new QRCode({
  data: "https://example.com",
  width: 256,
  height: 256,
  dotsOptions: {
    type: "rounded",
    color: "#4267b2",
  },
});

// Get SVG string
const svg = await qr.getSVG();

// Get as Buffer
const buffer = await qr.getBuffer("svg");

// Get as base64 data URI
const dataUri = await qr.getDataURI("svg");

// Write directly to filesystem
await qr.download({ name: "my-qr", extension: "svg" });
```

### Node API

```ts
class QRCode {
  constructor(options?: Partial<Options> & { imageLoader?: ImageLoader });

  update(options?: Partial<Options>): void;
  getSVG(): Promise<string>;
  getDataURI(format?: "svg"): Promise<string>;
  getBuffer(format?: "svg"): Promise<Buffer>;
  download(format?: FileExtension | { name?: string; extension?: FileExtension }): Promise<void>;
}
```

### Embedding images in Node.js

Pass a custom `imageLoader` to support center logos:

```ts
import { QRCode } from "@acutenetwork/fey/node";
import fs from "fs";

const qr = new QRCode({
  data: "https://example.com",
  image: "logo.png",
  imageLoader: async (uri) => {
    // Return width, height, and a data URI
    const buffer = fs.readFileSync(uri as string);
    const base64 = buffer.toString("base64");
    return {
      width: 100,
      height: 100,
      dataUri: `data:image/png;base64,${base64}`,
    };
  },
});

const svg = await qr.getSVG();
```

---

## React

```bash
pnpm add @acutenetwork/fey react react-dom
```

### Component

```tsx
import { QRCode } from "@acutenetwork/fey/react";

function App() {
  return (
    <QRCode
      data="https://example.com"
      width={256}
      height={256}
      dotsOptions={{ type: "rounded", color: "#4267b2" }}
      className="my-qr"
      style={{ border: "1px solid #eee" }}
    />
  );
}
```

### Hook

For more control (access to the underlying QRCode instance):

```tsx
import { useQRCode } from "@acutenetwork/fey/react";

function App() {
  const { ref, qrCode } = useQRCode({
    data: "https://example.com",
    width: 256,
    height: 256,
    dotsOptions: { type: "rounded", color: "#4267b2" },
  });

  const handleDownload = async () => {
    const svg = await qrCode.current?.getSVG();
    console.log(svg);
  };

  return (
    <>
      <div ref={ref} />
      <button onClick={handleDownload}>Download SVG</button>
    </>
  );
}
```

### React API

```ts
// Component — props are Options + className + style
function QRCode(props: Partial<Options> & {
  className?: string;
  style?: React.CSSProperties;
}): JSX.Element;

// Hook — returns a ref and the QRCode instance
function useQRCode(options: Partial<Options>): {
  ref: RefObject<HTMLDivElement>;
  qrCode: RefObject<QRCodeInstance>;
};
```

---

## React Native

```bash
pnpm add @acutenetwork/fey react-native-svg
```

```tsx
import { QRCode } from "@acutenetwork/fey/native";

function App() {
  return (
    <QRCode
      data="https://example.com"
      width={256}
      height={256}
      dotsOptions={{ type: "rounded", color: "#4267b2" }}
      onReady={({ toDataURL }) => {
        toDataURL().then((uri) => console.log(uri));
      }}
    />
  );
}
```

### React Native API

```ts
function QRCode(props: Partial<Options> & {
  onReady?: (helpers: { toDataURL: () => Promise<string> }) => void;
}): React.ReactElement | null;
```

Supports all styling options. Images can be local assets (`require("./logo.png")`) or remote URLs.

---

## Options

All platforms share the same `Options` type:

```ts
type Options = {
  // Content
  data?: string;
  image?: string | number;

  // Dimensions
  width?: number;              // default: 300
  height?: number;             // default: 300
  margin?: number;             // default: 0

  // Rendering
  type?: "svg" | "canvas";     // default: "canvas" (browser only)
  shape?: "square" | "circle"; // default: "square"

  // QR encoding
  qrOptions?: {
    typeNumber?: 0-40;              // 0 = auto, default: 0
    mode?: "Numeric" | "Alphanumeric" | "Byte" | "Kanji";
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";  // default: "Q"
  };

  // Dot styling
  dotsOptions?: {
    type?: "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
    color?: string;            // default: "#000"
    gradient?: Gradient;
    roundSize?: boolean;       // default: true
  };

  // Corner square styling (the 3 large squares)
  cornersSquareOptions?: {
    type?: "dot" | "square" | "extra-rounded";
    color?: string;
    gradient?: Gradient;
  };

  // Corner dot styling (the inner dot of corner squares)
  cornersDotOptions?: {
    type?: "dot" | "square";
    color?: string;
    gradient?: Gradient;
  };

  // Background
  backgroundOptions?: {
    color?: string;            // default: "#fff"
    round?: number;            // 0-1, corner roundness
    gradient?: Gradient;
  };

  // Image overlay
  imageOptions?: {
    hideBackgroundDots?: boolean;  // default: true
    imageSize?: number;            // 0-1, default: 0.4
    crossOrigin?: string;
    margin?: number;               // default: 0
  };
};
```

### Gradient

```ts
type Gradient = {
  type: "linear" | "radial";
  rotation?: number;           // radians, for linear gradients
  colorStops: {
    offset: number;            // 0-1
    color: string;
  }[];
};
```

### Example with gradients

```ts
const qr = new QRCode({
  data: "https://example.com",
  width: 300,
  height: 300,
  dotsOptions: {
    type: "rounded",
    gradient: {
      type: "linear",
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: "#8688B2" },
        { offset: 1, color: "#77779C" },
      ],
    },
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#5D5D8D",
  },
  cornersDotOptions: {
    type: "dot",
    color: "#5D5D8D",
  },
  backgroundOptions: {
    color: "#E8E8F0",
  },
});
```

---

## Dot Styles

| Type | Description |
|------|-------------|
| `"square"` | Sharp square dots (default) |
| `"dots"` | Circular dots |
| `"rounded"` | Rounded squares that connect to neighbors |
| `"extra-rounded"` | More aggressively rounded connections |
| `"classy"` | Rounded on opposite corners |
| `"classy-rounded"` | Classy with extra-rounded connections |

## Corner Square Styles

| Type | Description |
|------|-------------|
| `"square"` | Sharp square frame |
| `"dot"` | Circular ring frame |
| `"extra-rounded"` | Rounded rectangle frame |

## Corner Dot Styles

| Type | Description |
|------|-------------|
| `"square"` | Sharp square inner dot |
| `"dot"` | Circular inner dot |

---

## Error Correction

| Level | Recovery | Best for |
|-------|----------|----------|
| `"L"` | ~7% | Maximum data density |
| `"M"` | ~15% | Balanced |
| `"Q"` | ~25% | Default, good with logos |
| `"H"` | ~30% | Large logos, harsh conditions |

Higher error correction allows larger image overlays but increases QR code density.

---

## Exports

Each entry point re-exports all types and constants for convenience:

```ts
import {
  QRCode,
  // Types
  type Options,
  type FileExtension,
  type DotType,
  type CornerSquareType,
  type CornerDotType,
  type Gradient,
  type DownloadOptions,
  // Constants
  dotTypes,
  cornerDotTypes,
  cornerSquareTypes,
  errorCorrectionLevels,
  errorCorrectionPercents,
  drawTypes,
  shapeTypes,
  gradientTypes,
  modes,
  qrTypes,
} from "@acutenetwork/fey"; // or /node, /react, /native
```

---

## Architecture

```
src/
  index.ts          Entry: browser/vanilla JS
  node.ts           Entry: Node.js (zero deps)
  react.ts          Entry: React component + hook
  native.ts         Entry: React Native component
  lib/              Shared, platform-agnostic core
    core/           QRSVG engine, default options
    figures/        Dot and corner shape renderers
    constants/      Type constants and enums
    tools/          Utilities (merge, sanitize, getMode, etc.)
    types/          TypeScript type definitions
  web/              Browser-specific (DOM renderer, image loader)
  node/             Node-specific (pure SVG serializer)
  react/            React component + hook
  native/           React Native component + SVG renderer
```

## License

MIT
