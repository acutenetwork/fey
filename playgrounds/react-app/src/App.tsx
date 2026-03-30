import { useState } from "react";
import { QRCode, useQRCode } from "@acutenetwork/fey/react";

function QRCodeComponent() {
  return (
    <div className="card">
      <h2>{"<QRCode /> Component"}</h2>
      <QRCode
        data="https://example.com"
        width={256}
        height={256}
        type="svg"
        dotsOptions={{ type: "rounded", color: "#4267b2" }}
        cornersSquareOptions={{ type: "extra-rounded", color: "#4267b2" }}
        cornersDotOptions={{ type: "dot", color: "#4267b2" }}
        backgroundOptions={{ color: "#e9ebee" }}
      />
    </div>
  );
}

function QRCodeWithHook() {
  const [svgPreview, setSvgPreview] = useState<string>("");
  const { ref, qrCode } = useQRCode({
    data: "https://github.com/acutenetwork/fey",
    width: 256,
    height: 256,
    type: "svg",
    dotsOptions: {
      type: "classy-rounded",
      gradient: {
        type: "linear",
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: "#8B5CF6" },
          { offset: 1, color: "#EC4899" },
        ],
      },
    },
    cornersSquareOptions: { type: "extra-rounded", color: "#7C3AED" },
    cornersDotOptions: { type: "dot", color: "#7C3AED" },
    backgroundOptions: { color: "#FAF5FF" },
  });

  const handleGetSVG = async () => {
    const svg = await qrCode.current?.getSVG();
    if (svg) setSvgPreview(svg.substring(0, 200) + "...");
  };

  const handleDownload = () => {
    qrCode.current?.download({ name: "fey-qr", extension: "svg" });
  };

  return (
    <div className="card">
      <h2>useQRCode() Hook</h2>
      <div ref={ref} />
      <div className="actions">
        <button onClick={handleGetSVG}>Get SVG</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      {svgPreview && <pre className="preview">{svgPreview}</pre>}
    </div>
  );
}

function DynamicQRCode() {
  const [text, setText] = useState("https://acute.network");
  const [dotType, setDotType] = useState<string>("rounded");

  return (
    <div className="card">
      <h2>Dynamic Options</h2>
      <QRCode
        data={text}
        width={256}
        height={256}
        type="svg"
        dotsOptions={{ type: dotType as "rounded" | "dots" | "square" | "classy", color: "#059669" }}
        cornersSquareOptions={{ type: "dot", color: "#047857" }}
        backgroundOptions={{ color: "#ECFDF5" }}
      />
      <div className="controls">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter data..."
        />
        <select value={dotType} onChange={(e) => setDotType(e.target.value)}>
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </select>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <h1>@acutenetwork/fey</h1>
      <p>React Playground</p>
      <div className="grid">
        <QRCodeComponent />
        <QRCodeWithHook />
        <DynamicQRCode />
      </div>
    </div>
  );
}
