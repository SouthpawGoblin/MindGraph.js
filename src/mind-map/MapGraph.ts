import BasicMapGraph from "./BasicMapGraph";
import { Vec2 } from "../common/types";
import MapNode from "./MapNode";

/**
 * BasicMapGraph with canvas interactions
 */
export default class MapGraph extends BasicMapGraph {
  protected _leftDragging: boolean;
  protected _rightDragging: boolean;

  constructor(dom: HTMLElement) {
    super(dom);
    this._leftDragging = false;
    this._rightDragging = false;
    this._registerInteractions();
  }

  dispose() {
    this._unregisterInteractions();
    super.dispose();
  }

  private _registerInteractions() {
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

  private _unregisterInteractions() {

  }
  
  private handleWheel = (ev: WheelEvent) => {
    ev.preventDefault();
    if (ev.ctrlKey) {
      // scaling
      const deltaScale = ev.deltaY > 0 ? -0.05 : 0.05;
      let scale = this._scale + deltaScale;
      scale = scale > 4 ? 4 : scale;
      scale = scale < 0.2 ? 0.2 : scale;
      this.scale(scale);
    } else {
      // scrolling
      const trans = this._translate;
      this.translate({
        x: trans.x,
        y: trans.y - ev.deltaY * 5
      });
    }
  }

  private handleMouseDown = (ev: MouseEvent) => {
    if (ev.button === 0) {
      this._leftDragging = true;
    } else if (ev.button === 2) {
      this._rightDragging = true;
    }
  }

  private handleMouseUp = (ev: MouseEvent) => {
    if (ev.button === 0) {
      this._leftDragging = false;
    } else if (ev.button === 2) {
      this._rightDragging = false;
    }
  }

  private handleMouseLeave = () => {
    this._leftDragging = false;
    this._rightDragging = false;
  }

  private handleMouseMove = (ev: MouseEvent) => {
    if (this._leftDragging) {
      const deltaPos: Vec2 = {
        x: ev.movementX,
        y: ev.movementY
      };
      const trans = this._translate;
      this.translate({
        x: trans.x + deltaPos.x,
        y: trans.y + deltaPos.y
      });
    } else if (this._rightDragging) {
      // TODO: right mouse dragging logic
    }
  }

  private handleContextMenu = (ev: MouseEvent) => {
    ev.preventDefault();
  }

  private _onCanvasClick = (ev: MouseEvent) => {
    const pos: Vec2 = {
      x: ev.offsetX - this._center.x - this._translate.x,
      y: ev.offsetY - this._center.y - this._translate.y
    };
    const node = this._getNodeAtPosition(pos);
    if (node && node.id === this._lastSelectedNodeId) {
      return;
    }
    if (this._lastSelectedNodeId >= 0) {
      this._nodeIndices[this._lastSelectedNodeId].selected(false);
      this._lastSelectedNodeId = -1;
    }
    if (node) {
      node.selected(true);
      this._lastSelectedNodeId = node.id;
    }
    this._needsRerender = true;
  }

  private _getNodeAtPosition(pos: Vec2): MapNode | null {
    for (let id in this._nodeIndices) {
      const node = this._nodeIndices[id];
      const scaledLT: Vec2 = {
        x: node.position().x * this._scale,
        y: node.position().y * this._scale
      };
      const scaledRB: Vec2 = {
        x: scaledLT.x + node.size.w * this._scale,
        y: scaledLT.y + node.size.h * this._scale
      };
      if (pos.x >= scaledLT.x && pos.x <= scaledRB.x && pos.y >= scaledLT.y && pos.y <= scaledRB.y) {
        return node;
      }
    }
    return null;
  }
}