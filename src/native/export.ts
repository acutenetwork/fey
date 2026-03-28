import Svg from "react-native-svg";
import React from "react";

export async function exportToBase64(svgRef: React.RefObject<Svg | null>): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!svgRef.current) {
      return reject("Svg ref is not available");
    }
    svgRef.current.toDataURL((base64: string) => {
      resolve(`data:image/png;base64,${base64}`);
    });
  });
}
