import MapNode from "./MapNode";
import { Vec2, Rect, Size } from "../common/types";
import BasicCanvasControl from "../common/BasicCanvasControl";
import _ from './utils';
import { MapNodeType } from "./types";
import { MAP_VERTICAL_INTERVAL, MAP_HORIZONTAL_INTERVAL, MAP_SELECTION_STYLE } from "./constants";

export default class MapGraph {
  protected _root: MapNode;
  protected _nodeIndices: { [key: number]: MapNode };
  protected _parentDom: HTMLElement;
  protected _canvas: HTMLCanvasElement;
  protected _ctx: CanvasRenderingContext2D;
  protected _center: Vec2;
  protected _scale: number;
  protected _translate: Vec2;
  protected _needsRerender: boolean;
  protected _needsReposition: boolean;
  protected _renderLoop: boolean;
  protected _canvasControl: BasicCanvasControl | null;
  protected _lastSelectedNodeId: number;

  protected static nextNodeId: number = 0;

  constructor(dom: HTMLElement) {
    this._parentDom = dom;
    this._root = new MapNode(MapGraph.nextNodeId++, 'root', 0, 'Main Theme');
    this._nodeIndices = { [this._root.id]: this._root };
    const canvas = document.createElement('canvas');
    canvas.id = 'mind-graph-map';
    canvas.width = this._parentDom.clientWidth;
    canvas.height = this._parentDom.clientHeight;
    this._parentDom.appendChild(canvas);
    this._canvas = canvas;
    this._center = {
      x: this._canvas.width / 2,
      y: this._canvas.height / 2
    };
    const ctx = this._canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context 2d.');
    }
    this._ctx = ctx;
    this._scale = 1;
    this._translate = { x: 0, y: 0 };
    this._needsRerender = true;
    this._needsReposition = true;
    this._renderLoop = true;
    const control = new BasicCanvasControl(this._canvas);
    control.onScroll = this._onScroll.bind(this);
    control.onScale = this._onScale.bind(this);
    control.onPan = this._onPan.bind(this);
    this._canvasControl = control;
    this._lastSelectedNodeId = -1;
    this._registerInteractions();
  }

  scale(scale?: number): number {
    if (typeof scale !== 'undefined' && scale !== this._scale) {
      this._scale = scale;
      this._needsRerender = true;
    }
    return this._scale;
  }

  translate(translate?: Vec2): Vec2 {
    if (typeof translate !== 'undefined' && (translate.x !== this._translate.x || translate.y !== this._translate.y)) {
      this._translate = translate;
      this._needsRerender = true;
    }
    return this._translate;
  }

  get rootId(): number {
    return this._root.id;
  }

  // returns added node's id
  addNode(parentId: number, text?: string): number {
    const parent = this._nodeIndices[parentId];
    if (!parent) {
      throw new Error('"addNode" failed, parent node not found.');
    }
    const nodeType: MapNodeType = parent.type() === 'root' ? 'primary' : 'secondary';
    const node = new MapNode(MapGraph.nextNodeId++, nodeType, parent.depth + 1, text);
    parent.children.push(node);
    node.parent = parent;
    this._traceBackUpdateSpaces(parent);
    this._nodeIndices[node.id] = node;
    this._needsRerender = true;
    this._needsReposition = true;
    return node.id;
  }

  // returns deleted node's parent id
  deleteNode(nodeId: number): number {
    const node = this._nodeIndices[nodeId];
    // ROOT node cannot be deleted
    if (!node || !node.parent) {
      return -1;
    }
    const idx = node.parent.children.findIndex(child => child.id === nodeId);
    node.parent.children.splice(idx, 1);
    this._traceBackUpdateSpaces(node.parent);
    delete this._nodeIndices[nodeId];
    this._needsRerender = true;
    this._needsReposition = true;
    return node.parent.id;
  }

  updateNode(nodeId: number, text: string) {
    const node = this._nodeIndices[nodeId];
    if (!node) {
      throw new Error('"updateNode" failed, node not found.');
    }
    node.text(text);
    this._traceBackUpdateSpaces(node);
    this._needsRerender = true;
    this._needsReposition = true;
  }

  dispose() {
    this._renderLoop = false;
    this._canvasControl?.dispose();
    this._unregisterInteractions();
    this._canvas.remove();
  }

  render = () => {
    if (!this._renderLoop) {
      return;
    }
    this._innerRender();
    requestAnimationFrame(this.render);
  }

  private _innerRender() {
    if (!this._needsRerender) {
      return;
    }
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.translate(
      this._center.x + this._translate.x,
      this._center.y + this._translate.y
    );
    // BFS node tree rendering
    if (this._needsReposition) {
      this._root.position({
        x: -this._root.size.w / 2, 
        y: -this._root.size.h / 2
      });
      const nodes: MapNode[] = [this._root];
      while (nodes.length > 0) {
        const node = nodes.shift();
        if (!node) {
          continue;
        }
        this._renderNode(node);
        const childPosX = node.position().x + node.size.w + MAP_HORIZONTAL_INTERVAL;
        let childPosY = node.position().y + node.size.h / 2 - node.treeSpace().h / 2;
        node.children.forEach((child) => {
          childPosY += child.treeSpace().h / 2 - child.size.h / 2;
          child.position({ x: childPosX, y: childPosY });
          this._renderLink(node, child);
          nodes.push(child);
          childPosY += child.size.h / 2 + child.treeSpace().h / 2 + MAP_VERTICAL_INTERVAL;
        });
      }
    } else {
      const nodes: MapNode[] = [this._root];
      while (nodes.length > 0) {
        const node = nodes.shift();
        if (!node) {
          continue;
        }
        this._renderNode(node);
        node.children.forEach((child) => {
          this._renderLink(node, child);
          nodes.push(child);
        });
      }
    }
    this._renderSelection();
    this._needsRerender = false;
    this._needsReposition = false;
  }

  private _renderNode(node: MapNode) {
    const style = _.getScaledNodeStyle(node.type(), this._scale);
    const pos: Vec2 = {
      x: node.position().x * this._scale,
      y: node.position().y * this._scale
    };
    const size: Size = {
      w: node.size.w * this._scale,
      h: node.size.h * this._scale
    };
    const ctx = this._ctx;
    // TODO: support rounded rect
    const innerRect: Rect = {
      x: pos.x + style.borderWidth,
      y: pos.y + style.borderWidth,
      w: size.w - style.borderWidth * 2,
      h: size.h - style.borderWidth * 2,
    };
    ctx.beginPath();
    ctx.fillStyle = style.background;
    ctx.fillRect(innerRect.x, innerRect.y, innerRect.w, innerRect.h);
    if (style.borderWidth > 0) {
      ctx.beginPath();
      const borderRect: Rect = {
        x: pos.x + style.borderWidth / 2,
        y: pos.y + style.borderWidth / 2,
        w: size.w - style.borderWidth,
        h: size.h - style.borderWidth
      };
      ctx.strokeStyle = style.borderColor;
      ctx.lineWidth = style.borderWidth; 
      ctx.strokeRect(borderRect.x, borderRect.y, borderRect.w, borderRect.h);
    }
    ctx.beginPath();
    ctx.font = `${style.fontStyle} normal ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.fillText(node.text(), pos.x + style.padding + style.borderWidth, pos.y + style.padding + style.borderWidth + style.fontSize);
  }

  private _renderLink(node1: MapNode, node2: MapNode) {
    const pos1: Vec2 = {
      x: (node1.position().x + node1.size.w) * this._scale,
      y: (node1.position().y + node1.size.h / 2) * this._scale
    };
    const pos2: Vec2 = {
      x: node2.position().x * this._scale,
      y: (node2.position().y + node2.size.h / 2) * this._scale
    };
    const deltaX = pos2.x - pos1.x;
    const linkStyle = _.getScaledLinkStyle(this._scale);
    const ctx = this._ctx;
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.quadraticCurveTo(
      pos1.x + linkStyle.cp2Ratio * deltaX,
      pos2.y,
      pos2.x,
      pos2.y  
    );
    ctx.lineWidth = linkStyle.lineWidth;
    ctx.strokeStyle = linkStyle.lineColor;
    ctx.stroke();
  }

  private _renderSelection() {
    if (this._lastSelectedNodeId < 0) {
      return;
    }
    const node = this._nodeIndices[this._lastSelectedNodeId];
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

  private _onScroll(deltaY: number) {
    const trans = this._translate;
    this.translate({
      x: trans.x,
      y: trans.y - deltaY * 5
    });
  }

  private _onScale(deltaScale: number) {
    let scale = this._scale + deltaScale;
    scale = scale > 4 ? 4 : scale;
    scale = scale < 0.2 ? 0.2 : scale;
    this.scale(scale);
  }

  private _onPan(deltaPos: Vec2) {
    const trans = this._translate;
    this.translate({
      x: trans.x + deltaPos.x,
      y: trans.y + deltaPos.y
    });
  }

  // call this every time a node's size/chilren changes
  private _traceBackUpdateSpaces(node: MapNode) {
    const oldSpace = node.treeSpace();
    let childrenMaxWidth = -Infinity;
    let childrenTotalHeight = node.children.reduce((total, child) => {
      if (child.size.w > childrenMaxWidth) {
        childrenMaxWidth = child.size.w;
      }
      return total + child.treeSpace().h;
    }, 0);
    childrenTotalHeight += (node.children.length - 1) * MAP_VERTICAL_INTERVAL;
    if (childrenTotalHeight < node.size.h) {
      childrenTotalHeight = node.size.h;
    }
    let deltaWidth = childrenMaxWidth - (oldSpace.w - node.size.w - MAP_HORIZONTAL_INTERVAL);
    let deltaHeight = childrenTotalHeight - oldSpace.h;
    if (deltaWidth !== 0 || deltaHeight !== 0) {
      let current: MapNode | null = node;
      while(current) {
        current.treeSpace({
          w: current.treeSpace().w + deltaWidth,
          h: current.treeSpace().h + deltaHeight
        });
        current = current.parent;
      }
    }
  }

  private _registerInteractions() {
    const canvas = this._canvas;
    canvas.addEventListener('click', this._onCanvasClick);
    // TODO:
  }

  private _unregisterInteractions() {
    // TODO:
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