import { Vec2 } from "./types";

export default interface BasicGraph {
  getCanvas: () => HTMLCanvasElement;
  getScale: () => number;
  getTranslate: () => Vec2;
  setScale: (scale: number) => void;
  setTranslate: (translate: Vec2) => void;
  render: () => void;
  dispose: () => void;
}