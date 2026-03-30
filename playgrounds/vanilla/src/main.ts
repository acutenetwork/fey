import { QRCode } from "@acutenetwork/fey";

const log = document.getElementById("log")!;
const grid = document.getElementById("grid")!;

function addCard(title: string, qr: QRCode) {
  const card = document.createElement("div");
  card.className = "card";

  const heading = document.createElement("h2");
  heading.textContent = title;
  card.appendChild(heading);

  const container = document.createElement("div");
  container.className = "qr-container";
  card.appendChild(container);

  qr.append(container);

  const actions = document.createElement("div");
  actions.className = "actions";

  const svgBtn = document.createElement("button");
  svgBtn.textContent = "Get SVG";
  svgBtn.onclick = async () => {
    const svg = await qr.getSVG();
    log.textContent = svg.substring(0, 500) + "...";
  };
  actions.appendChild(svgBtn);

  const dataUriBtn = document.createElement("button");
  dataUriBtn.textContent = "Data URI";
  dataUriBtn.onclick = async () => {
    const uri = await qr.getDataURI("svg");
    log.textContent = uri.substring(0, 200) + "...";
  };
  actions.appendChild(dataUriBtn);

  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download SVG";
  downloadBtn.onclick = () => qr.download("svg");
  actions.appendChild(downloadBtn);

  card.appendChild(actions);
  grid.appendChild(card);
}

// 1. Default square style
addCard(
  "Default (Square)",
  new QRCode({
    data: "https://example.com",
    width: 256,
    height: 256,
    type: "svg",
  })
);

// 2. Rounded with color
addCard(
  "Rounded + Color",
  new QRCode({
    data: "https://github.com/acutenetwork/fey",
    width: 256,
    height: 256,
    type: "svg",
    dotsOptions: { type: "rounded", color: "#4267b2" },
    cornersSquareOptions: { type: "extra-rounded", color: "#4267b2" },
    cornersDotOptions: { type: "dot", color: "#4267b2" },
    backgroundOptions: { color: "#e9ebee" },
  })
);

// 3. Gradient
addCard(
  "Gradient",
  new QRCode({
    data: "https://acute.network",
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
  })
);

// 4. Circle shape
addCard(
  "Circle Shape",
  new QRCode({
    data: "https://acute.network",
    width: 256,
    height: 256,
    type: "svg",
    shape: "circle",
    dotsOptions: { type: "dots", color: "#059669" },
    cornersSquareOptions: { type: "dot", color: "#047857" },
    cornersDotOptions: { type: "dot", color: "#047857" },
    backgroundOptions: { color: "#ECFDF5" },
  })
);

// 5. Extra rounded
addCard(
  "Extra Rounded",
  new QRCode({
    data: "Hello, World!",
    width: 256,
    height: 256,
    type: "svg",
    dotsOptions: { type: "extra-rounded", color: "#DC2626" },
    cornersSquareOptions: { type: "extra-rounded", color: "#B91C1C" },
    cornersDotOptions: { type: "dot", color: "#B91C1C" },
    backgroundOptions: { color: "#FEF2F2" },
  })
);

// 6. Classy
addCard(
  "Classy",
  new QRCode({
    data: "https://www.npmjs.com/package/@acutenetwork/fey",
    width: 256,
    height: 256,
    type: "svg",
    dotsOptions: { type: "classy", color: "#1E293B" },
    cornersSquareOptions: { type: "square", color: "#0F172A" },
    backgroundOptions: { color: "#F8FAFC" },
  })
);
