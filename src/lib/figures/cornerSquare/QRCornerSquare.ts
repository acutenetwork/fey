import cornerSquareTypes from "../../constants/cornerSquareTypes";
import { CornerSquareType, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs } from "../../types";
import { SvgElementDescriptor } from "../../types/svg-descriptors";

export const availableCornerSquareTypes = Object.values(cornerSquareTypes);

export default class QRCornerSquare {
  _descriptor?: SvgElementDescriptor;
  _type: CornerSquareType;

  constructor({ type }: { type: CornerSquareType }) {
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerSquareTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerSquareTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case cornerSquareTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    if (this._descriptor) {
      this._descriptor.attributes["transform"] = `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`;
    }
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._descriptor = {
          tag: "path",
          attributes: {
            "clip-rule": "evenodd",
            d:
              `M ${x + size / 2} ${y}` +
              `a ${size / 2} ${size / 2} 0 1 0 0.1 0` +
              `z` +
              `m 0 ${dotSize}` +
              `a ${size / 2 - dotSize} ${size / 2 - dotSize} 0 1 1 -0.1 0` +
              `Z`
          },
          children: []
        };
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._descriptor = {
          tag: "path",
          attributes: {
            "clip-rule": "evenodd",
            d:
              `M ${x} ${y}` +
              `v ${size}` +
              `h ${size}` +
              `v ${-size}` +
              `z` +
              `M ${x + dotSize} ${y + dotSize}` +
              `h ${size - 2 * dotSize}` +
              `v ${size - 2 * dotSize}` +
              `h ${-size + 2 * dotSize}` +
              `z`
          },
          children: []
        };
      }
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._descriptor = {
          tag: "path",
          attributes: {
            "clip-rule": "evenodd",
            d:
              `M ${x} ${y + 2.5 * dotSize}` +
              `v ${2 * dotSize}` +
              `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${dotSize * 2.5}` +
              `h ${2 * dotSize}` +
              `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${-dotSize * 2.5}` +
              `v ${-2 * dotSize}` +
              `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${-dotSize * 2.5}` +
              `h ${-2 * dotSize}` +
              `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${dotSize * 2.5}` +
              `M ${x + 2.5 * dotSize} ${y + dotSize}` +
              `h ${2 * dotSize}` +
              `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${dotSize * 1.5}` +
              `v ${2 * dotSize}` +
              `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${dotSize * 1.5}` +
              `h ${-2 * dotSize}` +
              `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
              `v ${-2 * dotSize}` +
              `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${-dotSize * 1.5}`
          },
          children: []
        };
      }
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawExtraRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicExtraRounded({ x, y, size, rotation });
  }
}
