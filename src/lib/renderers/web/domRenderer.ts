import { SvgElementDescriptor } from "../../types/svg-descriptors";

export function renderToDOM(descriptor: SvgElementDescriptor, document: Document): SVGElement {
  const el = document.createElementNS("http://www.w3.org/2000/svg", descriptor.tag);
  for (const [key, value] of Object.entries(descriptor.attributes)) {
    el.setAttribute(key, value);
  }
  for (const child of descriptor.children) {
    el.appendChild(renderToDOM(child, document));
  }
  return el;
}
