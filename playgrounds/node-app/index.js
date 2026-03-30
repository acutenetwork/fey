import { QRCode } from "@acutenetwork/fey/node";
import fs from "fs";
import path from "path";

const outDir = path.join(import.meta.dirname, "output");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// 1. Basic QR code
console.log("--- Basic QR Code ---");
const basic = new QRCode({
  data: "https://example.com",
  width: 256,
  height: 256,
});
const basicSvg = await basic.getSVG();
fs.writeFileSync(path.join(outDir, "basic.svg"), basicSvg);
console.log("  Written: output/basic.svg (%d bytes)", basicSvg.length);

// 2. Styled QR code
console.log("\n--- Styled QR Code ---");
const styled = new QRCode({
  data: "https://github.com/acutenetwork/fey",
  width: 300,
  height: 300,
  dotsOptions: { type: "rounded", color: "#4267b2" },
  cornersSquareOptions: { type: "extra-rounded", color: "#4267b2" },
  cornersDotOptions: { type: "dot", color: "#4267b2" },
  backgroundOptions: { color: "#e9ebee" },
});
const styledSvg = await styled.getSVG();
fs.writeFileSync(path.join(outDir, "styled.svg"), styledSvg);
console.log("  Written: output/styled.svg (%d bytes)", styledSvg.length);

// 3. Gradient QR code
console.log("\n--- Gradient QR Code ---");
const gradient = new QRCode({
  data: "https://acute.network",
  width: 300,
  height: 300,
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
  backgroundOptions: { color: "#FAF5FF" },
});
const gradientSvg = await gradient.getSVG();
fs.writeFileSync(path.join(outDir, "gradient.svg"), gradientSvg);
console.log("  Written: output/gradient.svg (%d bytes)", gradientSvg.length);

// 4. Get buffer
console.log("\n--- Buffer Output ---");
const buffer = await basic.getBuffer("svg");
console.log("  Buffer: %d bytes, is Buffer: %s", buffer.length, Buffer.isBuffer(buffer));

// 5. Get data URI
console.log("\n--- Data URI Output ---");
const dataUri = await basic.getDataURI("svg");
console.log("  Data URI: %s... (%d chars)", dataUri.substring(0, 50), dataUri.length);

// 6. Download (writes to filesystem)
console.log("\n--- Download (filesystem write) ---");
await styled.download({ name: path.join(outDir, "downloaded"), extension: "svg" });
console.log("  Written: output/downloaded.svg");

// 7. Update options
console.log("\n--- Update Options ---");
basic.update({ data: "Updated content!", dotsOptions: { type: "dots", color: "#DC2626" } });
const updatedSvg = await basic.getSVG();
fs.writeFileSync(path.join(outDir, "updated.svg"), updatedSvg);
console.log("  Written: output/updated.svg (%d bytes)", updatedSvg.length);

console.log("\nAll done! Check the output/ directory.");
