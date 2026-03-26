import { QRCode } from "../src/index";

const qr = new QRCode({
  data: "https://example.com",
  width: 300,
  height: 300,
  type: "svg",
  dotsOptions: {
    type: "rounded",
    color: "#4267b2",
  },
  backgroundOptions: {
    color: "#e9ebee",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#4267b2",
  },
});

qr.append(document.getElementById("qr")!);
