import { SvgElementDescriptor } from "../lib/types/svg-descriptors";

const SELF_CLOSING_TAGS = new Set(["circle", "rect", "path", "stop", "image"]);

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function serializeElement(descriptor: SvgElementDescriptor): string {
  const { tag, attributes, children } = descriptor;

  const attrs = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${escapeAttr(value)}"`)
    .join("");

  if (children.length === 0 && SELF_CLOSING_TAGS.has(tag)) {
    return `<${tag}${attrs}/>`;
  }

  const inner = children.map(serializeElement).join("");
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

export function serializeSvg(descriptor: SvgElementDescriptor): string {
  const attrs = { ...descriptor.attributes };
  if (!attrs["xmlns"]) {
    attrs["xmlns"] = "http://www.w3.org/2000/svg";
  }

  const root: SvgElementDescriptor = {
    ...descriptor,
    attributes: attrs,
  };

  return `<?xml version="1.0" standalone="no"?>\r\n${serializeElement(root)}`;
}
