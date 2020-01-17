import BasicMapGraph from "./BasicMapGraph";
import { Vec2, Size } from "../common/types";
import MapNode from "./MapNode";
import _ from "./utils";
import { MAP_NODE_STYLES } from "./constants";

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
    // add, delete, copy, cut, paste...key related interactions
    window.addEventListener('keyup', this._handleKeyUp);
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
    // add, delete, copy, cut, paste...key related interactions
    window.removeEventListener('keyup', this._handleKeyUp);
  }
  
  private _handleWheel = (ev: WheelEvent) => {
    ev.preventDefault();
    if (ev.ctrlKey) {
      // scaling
      const deltaScale = ev.deltaY > 0 ? -0.05 : 0.05;
      let scale = this._scale + deltaScale;
      scale = scale > 4 ? 4 : scale;
      scale = scale < 0.5 ? 0.5 : scale;
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
      const pos: Vec2 = this.domToCanvas({
        x: ev.offsetX,
        y: ev.offsetY
      });
      const node = this._getNodeAtPosition(pos);
      if (node) {
        this._draggingNodeId = node.id;
      }
      const selectedNode = this.selectedNode();
      if (selectedNode && (!node || node.id !== selectedNode.id)) {
        this.selectedNode(-1);
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
        this.selectedNode(this._draggingNodeId);
        this._draggingNodeId = -1;
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
    if (ev.button === 0) {
      const pos: Vec2 = this.domToCanvas({
        x: ev.offsetX,
        y: ev.offsetY
      });
      const node = this._getNodeAtPosition(pos);
      if (!node) {
        return;
      }
      this._renderInput(node);
    }
  }

  private _handleKeyUp = (ev: KeyboardEvent) => {
    const selectedNode = this.selectedNode();
    if (!selectedNode) {
      return;
    }
    switch(ev.key) {
      // TODO: support switch selection by arrow key, maybe need to use depth prop
      case "ArrowDown":
        break;
      case "ArrowUp":
        break;
      case "ArrowLeft":
        break;
      case "ArrowRight":
        break;
      case "Enter": { // Enter: add sibling node, Ctrl+Enter: add child node
        let newNodeId = -1;
        if (ev.ctrlKey) {
          newNodeId = this.addNode(selectedNode.id);
        } else {
          const parent = selectedNode.parent;
          if (parent) {
            const pos = parent.children.findIndex(child => child.id === selectedNode.id);
            newNodeId = this.addNode(parent.id, undefined, pos >= 0 ? pos + 1 : undefined);
          }
        }
        this.selectedNode(newNodeId);
        // FIXME: 此时新节点未被渲染，还未获得位置信息，需要在renderDone之类的钩子里调用_renderInput
        // this._renderInput(this.selectedNode());
        break;
      }
      case "Delete": {
        this.deleteNode(selectedNode.id);
        break;
      }
      case "Escape": {  // remove selection
        this.selectedNode(-1);
        break;
      }
      case "c": {
        if (ev.ctrlKey) { // copy
          this.copyNode(selectedNode.id);
        }
        break;
      }
      case "x": {
        if (ev.ctrlKey) { // cut
          this.cutNode(selectedNode.id);
        }
        break;
      }
      case "v": {
        if (ev.ctrlKey) { // paste
          this.pasteNode(selectedNode.id);
        }
        break;
      }
      default: return;
    }
  }

  private _handleContextMenu = (ev: MouseEvent) => {
    ev.preventDefault();
  }

  private _getNodeAtPosition(pos: Vec2): MapNode | null {
    for (let id in this._nodeIndices) {
      const node = this._nodeIndices[id];
      const lt: Vec2 = node.position();
      const rb: Vec2 = {
        x: lt.x + node.size.w,
        y: lt.y + node.size.h
      };
      if (pos.x >= lt.x && pos.x <= rb.x && pos.y >= lt.y && pos.y <= rb.y) {
        return node;
      }
    }
    return null;
  }

  private _renderInput(node: MapNode | null) {
    if (!node) {
      return;
    }
    const style = MAP_NODE_STYLES[node.type()];
    const textPadding = style.borderWidth;
    const inputLT: Vec2 = this.canvasToDom({
      x: node.position().x + textPadding,
      y: node.position().y + textPadding,
    });
    const inputSize: Size = {
      w: (node.size.w - textPadding * 2) * this._scale,
      h: (node.size.h - textPadding * 2) * this._scale
    };
    const scaledStyle = _.getScaledNodeStyle(node.type(), this._scale);
    const input = document.createElement('input');
    input.value = node.text();
    input.style.font = `${scaledStyle.fontStyle} normal ${scaledStyle.fontWeight} ${scaledStyle.fontSize}px ${scaledStyle.fontFamily}`;
    input.style.position = 'absolute';
    input.style.left = `${inputLT.x}px`;
    input.style.top = `${inputLT.y}px`;
    input.style.width = `${inputSize.w}px`;
    input.style.minWidth = '40px';
    input.style.height = `${inputSize.h}px`;
    input.addEventListener('blur', (ev: FocusEvent) => {
      const inputEle = ev.target as HTMLInputElement;
      if (inputEle.value && inputEle.value !== node.text()) {
        this.updateNode(node.id, inputEle.value);
      }
      inputEle.remove();
    });
    this._dom.appendChild(input);
    input.focus();
  }
}