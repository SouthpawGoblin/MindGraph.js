import { Vec2 } from "./types";

export default class BasicCanvasControl {
  private _canvas: HTMLCanvasElement;
  private _leftDragging: boolean;
  private _rightDragging: boolean;

  onScroll: (deltaY: number) => void = () => {};
  onScale: (deltaScale: number) => void = () => {};
  onPan: (deltaPos: Vec2) => void = () => {};

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._leftDragging = false;
    this._rightDragging = false;
    canvas.style.cursor = 'grab';
    this._register();
  }

  dispose() {
    const canvas = this._canvas;
    canvas.style.cursor = 'default';
    // zooming
    canvas.removeEventListener('wheel', this.handleWheel);
    // panning
    canvas.removeEventListener('mousedown', this.handleMouseDown);
    canvas.removeEventListener('mouseup', this.handleMouseUp);
    canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    canvas.removeEventListener('mousemove', this.handleMouseMove);
    // prevent default context menu when rotating
    canvas.removeEventListener('contextmenu', this.handleContextMenu);
  }

  private _register() {
    const canvas = this._canvas;
    // zooming
    canvas.addEventListener('wheel', this.handleWheel);
    // panning
    canvas.addEventListener('mousedown', this.handleMouseDown);
    canvas.addEventListener('mouseup', this.handleMouseUp);
    canvas.addEventListener('mouseleave', this.handleMouseLeave);
    canvas.addEventListener('mousemove', this.handleMouseMove);
    // prevent default context menu when rotating
    canvas.addEventListener('contextmenu', this.handleContextMenu);
  }

  private handleWheel = (ev: WheelEvent) => {
    ev.preventDefault();
    if (ev.ctrlKey) {
      // scaling
      const deltaScale = ev.deltaY > 0 ? -0.05 : 0.05;
      this.onScale(deltaScale)
    } else {
      // scrolling
      this.onScroll(ev.deltaY);
    }
  }

  private handleMouseDown = (ev: MouseEvent) => {
    if (ev.button === 0) {
      this._leftDragging = true
    } else if (ev.button === 2) {
      this._rightDragging = true
    }
  }

  private handleMouseUp = (ev: MouseEvent) => {
    if (ev.button === 0) {
      this._leftDragging = false
    } else if (ev.button === 2) {
      this._rightDragging = false
    }
  }

  private handleMouseLeave = () => {
    this._leftDragging = false
    this._rightDragging = false
  }

  private handleMouseMove = (ev: MouseEvent) => {
    if (this._leftDragging) {
      const deltaPos = {
        x: ev.movementX,
        y: ev.movementY
      };
      this.onPan(deltaPos);
    } else if (this._rightDragging) {
      // TODO: right mouse dragging logic
    }
  }

  private handleContextMenu = (ev: MouseEvent) => {
    ev.preventDefault()
  }
}