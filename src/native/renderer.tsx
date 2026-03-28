import React from "react";
import Svg, {
  Rect,
  Circle,
  Path,
  ClipPath,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Image as SvgImage,
  G
} from "react-native-svg";
import { SvgElementDescriptor } from "../lib/types/svg-descriptors";

const TAG_MAP: Record<string, React.ComponentType<Record<string, unknown>>> = {
  rect: Rect as unknown as React.ComponentType<Record<string, unknown>>,
  circle: Circle as unknown as React.ComponentType<Record<string, unknown>>,
  path: Path as unknown as React.ComponentType<Record<string, unknown>>,
  clipPath: ClipPath as unknown as React.ComponentType<Record<string, unknown>>,
  defs: Defs as unknown as React.ComponentType<Record<string, unknown>>,
  linearGradient: LinearGradient as unknown as React.ComponentType<Record<string, unknown>>,
  radialGradient: RadialGradient as unknown as React.ComponentType<Record<string, unknown>>,
  stop: Stop as unknown as React.ComponentType<Record<string, unknown>>,
  image: SvgImage as unknown as React.ComponentType<Record<string, unknown>>,
  g: G as unknown as React.ComponentType<Record<string, unknown>>
};

const ATTR_MAP: Record<string, string> = {
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "stop-color": "stopColor",
  "shape-rendering": "shapeRendering",
  "xlink:href": "href",
  "xmlns:xlink": "xmlnsXlink",
  "fill-rule": "fillRule",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  gradientUnits: "gradientUnits"
};

function mapAttributes(attributes: Record<string, string>): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [key, value] of Object.entries(attributes)) {
    const mappedKey = ATTR_MAP[key] || key;

    if ((key === "width" || key === "height") && value.endsWith("px")) {
      mapped[mappedKey] = value.slice(0, -2);
    } else if (value.includes("url('") || value.includes('url("')) {
      mapped[mappedKey] = value.replace(/url\(['"]([^'"]+)['"]\)/g, "url($1)");
    } else {
      mapped[mappedKey] = value;
    }
  }
  return mapped;
}

function renderNode(descriptor: SvgElementDescriptor, key: number | string): React.ReactElement {
  const Component = TAG_MAP[descriptor.tag];
  if (!Component) {
    return <G key={key}>{descriptor.children.map((child, i) => renderNode(child, i))}</G>;
  }

  const mappedAttrs = mapAttributes(descriptor.attributes);

  if (descriptor.children.length === 0) {
    return <Component key={key} {...mappedAttrs} />;
  }

  return (
    <Component key={key} {...mappedAttrs}>
      {descriptor.children.map((child, i) => renderNode(child, i))}
    </Component>
  );
}

export function renderToReactNativeSvg(
  descriptor: SvgElementDescriptor,
  svgRef?: React.RefObject<Svg | null>
): React.ReactElement {
  const attrs = mapAttributes(descriptor.attributes);

  return (
    <Svg ref={svgRef as React.Ref<Svg>} width={attrs.width} height={attrs.height} viewBox={attrs.viewBox}>
      {descriptor.children.map((child, i) => renderNode(child, i))}
    </Svg>
  );
}
