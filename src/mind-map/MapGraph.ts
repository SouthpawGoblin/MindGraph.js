import BasicMapGraph from "./BasicMapGraph";
import { Vec2, Size } from "../common/types";
import MapNode from "./MapNode";
import _ from "./utils";

/**
 * BasicMapGraph with canvas interactions
 */
export default class MapGraph extends BasicMapGraph {
  protected _mouseLeftDragging: boolean;
  protected _mouseRightDragging: boolean;
  protected _draggingNodeId: number;

  constructor(dom: HTMLElement) {
    super(dom);
    this._mouseLeftDragging = false;
    this._mouseRightDragging = false;
    this._draggingNodeId = -1;
    this._registerInteractions();
  }

  dispose() {
    this._unregisterInteractions();
    super.dispose();
  }

  // override
  protected _afterGraphRender() {
    this._renderSelection();
  }

  private _registerInteractions() {
    const canvas = this._canvas;
    // scaling and scrolling
    canvas.addEventListener('wheel', this._handleWheel);
    // panning and node dragging
    canvas.addEventListener('mousedown', this._handleMouseDown);
    canvas.addEventListener('mouseup', this._handleMouseUp);
    canvas.addEventListener('mouseleave', this._handleMouseLeave);
    canvas.addEventListener('mousemove', this._handleMouseMove);
    // updating node content
    canvas.addEventListener('dblclick', this._handleDoubleClick);
    // prevent default context menu when right click
    canvas.addEventListener('contextmenu', this._handleContextMenu);
  }

  private _unregisterInteractions() {
    const canvas = this._canvas;
    // scaling and scrolling
    canvas.removeEventListener('wheel', this._handleWheel);
    // panning and node dragging
    canvas.removeEventListener('mousedown', this._handleMouseDown);
    canvas.removeEventListener('mouseup', this._handleMouseUp);
    canvas.removeEventListener('mouseleave', this._handleMouseLeave);
    canvas.removeEventListener('mousemove', this._handleMouseMove);
    // updating node content
    canvas.removeEventListener('dblclick', this._handleDoubleClick);
    // prevent default context menu when right click
    canvas.removeEventListener('contextmenu', this._handleContextMenu);
  }
  
  private _handleWheel = (ev: WheelEvent) => {
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

  private _handleMouseDown = (ev: MouseEvent) => {
    if (ev.button === 0) {
      const pos: Vec2 = {
        x: ev.offsetX - this._center.x - this._translate.x,
        y: ev.offsetY - this._center.y - this._translate.y
      };
      const node = this._getNodeAtPosition(pos);
      if (node) {
        this._draggingNodeId = node.id;
      }
      if (this._selectedNodeId >= 0 && (!node || node.id !== this._selectedNodeId)) {
        this._nodeIndices[this._selectedNodeId].selected(false);
        this._selectedNodeId = -1;
        this._needsRerender = true;
      }
      this._mouseLeftDragging = true;
    } else if (ev.button === 2) {
      this._mouseRightDragging = true;
    }
  }

  private _handleMouseMove = (ev: MouseEvent) => {
    if (this._mouseLeftDragging) {
      if (this._draggingNodeId >= 0) {
        // dragging node
        // TODO: render dragging trace
      } else {
        // dragging canvas
        const deltaPos: Vec2 = {
          x: ev.movementX,
          y: ev.movementY
        };
        const trans = this._translate;
        this.translate({
          x: trans.x + deltaPos.x,
          y: trans.y + deltaPos.y
        });
      }
    } else if (this._mouseRightDragging) {
      // TODO: right mouse dragging logic
    }
  }

  private _handleMouseUp = (ev: MouseEvent) => {
    if (ev.button === 0) {
      if (this._draggingNodeId >= 0) {
        // TODO: possible node moving
        this._nodeIndices[this._draggingNodeId].selected(true);
        this._selectedNodeId = this._draggingNodeId;
        this._draggingNodeId = -1;
        this._needsRerender = true;
      }
      this._mouseLeftDragging = false;
    } else if (ev.button === 2) {
      this._mouseRightDragging = false;
    }
  }

  private _handleMouseLeave = () => {
    this._draggingNodeId = -1;
    this._mouseLeftDragging = false;
    this._mouseRightDragging = false;
  }

  private _handleDoubleClick = (ev: MouseEvent) => {

  }

  private _handleContextMenu = (ev: MouseEvent) => {
    ev.preventDefault();
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

  private _renderSelection() {
    if (this._selectedNodeId < 0) {
      return;
    }
    const node = this._nodeIndices[this._selectedNodeId];
    const scaledPos: Vec2 = {
      x: node.position().x * this._scale,
      y: node.position().y * this._scale
    };
    const scaledSize: Size = {
      w: node.size.w * this._scale,
      h: node.size.h * this._scale
    };
    const style = _.getScaledSelectionStyle(this._scale);
    const pos: Vec2 = {
      x: scaledPos.x - style.padding - style.outlineWidth / 2,
      y: scaledPos.y - style.padding - style.outlineWidth / 2
    };
    const size: Size = {
      w: scaledSize.w + style.padding * 2 + style.outlineWidth,
      h: scaledSize.h + style.padding * 2 + style.outlineWidth
    };
    const ctx = this._ctx;
    ctx.beginPath();
    ctx.strokeStyle = style.outlineColor;
    ctx.lineWidth = style.outlineWidth;
    ctx.strokeRect(pos.x, pos.y, size.w, size.h);
  }
}