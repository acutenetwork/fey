import cornerDotTypes from "../../constants/cornerDotTypes";
import { CornerDotType, RotateFigureArgs, BasicFigureDrawArgs, DrawArgs } from "../../types";
import { SvgElementDescriptor } from "../../types/svg-descriptors";

export const availableCornerDotTypes = Object.values(cornerDotTypes);

export default class QRCornerDot {
  _descriptor?: SvgElementDescriptor;
  _type: CornerDotType;

  constructor({ type }: { type: CornerDotType }) {
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.dot:
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

    this._rotateFigure({
      ...args,
      draw: () => {
        this._descriptor = {
          tag: "circle",
          attributes: {
            cx: String(x + size / 2),
            cy: String(y + size / 2),
            r: String(size / 2)
          },
          children: []
        };
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._descriptor = {
          tag: "rect",
          attributes: {
            x: String(x),
            y: String(y),
            width: String(size),
            height: String(size)
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
}
