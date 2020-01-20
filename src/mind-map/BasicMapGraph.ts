import MapNode from "./MapNode";
import { Vec2, Rect, Size } from "../common/types";
import _ from './utils';
import { MapNodeType, MapJson } from "./types";
import { MAP_VERTICAL_INTERVAL, MAP_HORIZONTAL_INTERVAL } from "./constants";

export default class BasicMapGraph {
  protected _root: MapNode;
  protected _nodeIndices: { [key: number]: MapNode };
  protected _dom: HTMLElement;
  protected _parentDom: HTMLElement;
  protected _canvas: HTMLCanvasElement;
  protected _ctx: CanvasRenderingContext2D;
  protected _center: Vec2;
  protected _scale: number;
  protected _translate: Vec2;
  protected _needsRerender: boolean;
  protected _needsReposition: boolean;
  protected _renderLoop: boolean;
  protected _selectedNodeId: number;
  protected _copiedNode: MapNode | null;
  protected _nextNodeId: number = 0;

  constructor(dom: HTMLElement, json?: MapJson) {
    this._parentDom = dom;
    this._root = new MapNode(this._nextNodeId++, 'root', 0, 'Main Theme');
    this._nodeIndices = { [this._root.id]: this._root };
    const canvas = document.createElement('canvas');
    canvas.width = this._parentDom.clientWidth;
    canvas.height = this._parentDom.clientHeight;
    const container = document.createElement('div');
    container.id = 'mind-graph-map';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'relative';
    container.appendChild(canvas);
    this._dom = container;
    this._parentDom.appendChild(container);
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
    this._selectedNodeId = -1;
    this._copiedNode = null;
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

  selectedNode(id?: number): MapNode | null {
    if (typeof id !== 'undefined' && id !== this._selectedNodeId) {
      this._selectedNodeId = id;
      this._needsRerender = true;
    }
    return this._selectedNodeId < 0 ? null : this._nodeIndices[this._selectedNodeId];
  }

  // returns added node's id
  addNode(parentId: number, text?: string, position?: number): number {
    const parent = this._nodeIndices[parentId];
    if (!parent) {
      throw new Error('"addNode" failed, parent node not found.');
    }
    const nodeType: MapNodeType = _.getChildNodeType(parent.type());
    const node = new MapNode(this._nextNodeId++, nodeType, parent.depth + 1, text);
    if (typeof position === 'number' && position >= 0 && position <= parent.children.length) {
      parent.children.splice(position, 0, node);
    } else {
      parent.children.push(node);
    }
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
    if (this._selectedNodeId === nodeId) {
      // change selection to siblings or parent
      if (node.parent.children.length > 0) {
        let childIndex = idx;
        if (idx >= node.parent.children.length) {
          childIndex--;
        }
        this._selectedNodeId = node.parent.children[childIndex].id;
      } else {
        this._selectedNodeId = node.parent.id;
      }
    }
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

  copyNode(nodeId: number) {
    const node = this._nodeIndices[nodeId];
    if (!node) {
      return;
    }
    this._copiedNode = node.clone();
  }

  cutNode(nodeId: number) {
    this.copyNode(nodeId);
    this.deleteNode(nodeId);
  }

  // TODO: extract BFS traverse
  pasteNode(parentNodeId: number) {
    if (!this._copiedNode) {
      return;
    }
    const parentMap: { [key: number]: number } = {};
    this._copiedNode.traverse(node => {
      let parentId = parentNodeId;
      if (node.parent && parentMap.hasOwnProperty(node.parent.id)) {
        parentId = parentMap[node.parent.id];
      }
      const id = this.addNode(parentId, node.text());
      parentMap[node.id] = id;
    });
  }

  dispose() {
    this._renderLoop = false;
    this._dom.remove();
  }

  render = () => {
    if (!this._renderLoop) {
      return;
    }
    this._innerRender();
    requestAnimationFrame(this.render);
  }

  canvasToDom(point: Vec2): Vec2 {
    return {
      x: point.x * this._scale + this._center.x + this._translate.x,
      y: point.y * this._scale + this._center.y + this._translate.y
    };
  }

  domToCanvas(point: Vec2): Vec2 {
    return {
      x: (point.x - this._center.x - this._translate.x) / this._scale,
      y: (point.y - this._center.y - this._translate.y) / this._scale
    };
  }

  toJson(): MapJson {
    const json: MapJson = {
      rootId: this._root.id
    };
    this._root.traverse(node => {
      json[node.id] = {
        id: node.id,
        text: node.text(),
        comment: node.comment(),
        parentId: node.parent ? node.parent.id : -1,
        childrenId: []
      };
      node.children.forEach(child => {
        json[node.id].childrenId.push(child.id);
      });
    })
    return json;
  }

  loadJson(json: MapJson) {
    const rootInfo = json[json.rootId];
    if (!rootInfo) {
      return;
    }
    this._nextNodeId = 0;
    this._root = new MapNode(this._nextNodeId++, 'root', 0, rootInfo.text, rootInfo.comment);
    this._nodeIndices = { [this._root.id]: this._root };
    const idMap: { [key: number]: number } = { [json.rootId]: this._root.id };
    const ids: number[] = [...rootInfo.childrenId];
    while (ids.length > 0) {
      const id = ids.shift() as number;
      const info = json[id];
      if (!info) {
        continue;
      }
      const nodeId = this.addNode(idMap[info.parentId], info.text);
      idMap[info.id] = nodeId;
      info.childrenId.forEach((childId: number) => ids.push(childId));
    }
  }

  protected _innerRender() {
    if (!this._needsRerender) {
      return;
    }
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.translate(
      this._center.x + this._translate.x,
      this._center.y + this._translate.y
    );

    // invoke hook
    this._beforGraphRender();

    // BFS node tree rendering
    if (this._needsReposition) {
      this._root.position({
        x: -this._root.size.w / 2, 
        y: -this._root.size.h / 2
      });
      this._root.traverse(node => {
        this._renderNode(node);
        const childPosX = node.position().x + node.size.w + MAP_HORIZONTAL_INTERVAL;
        let childPosY = node.position().y + node.size.h / 2 - node.treeSpace().h / 2;
        node.children.forEach((child) => {
          childPosY += child.treeSpace().h / 2 - child.size.h / 2;
          child.position({ x: childPosX, y: childPosY });
          this._renderLink(node, child);
          childPosY += child.size.h / 2 + child.treeSpace().h / 2 + MAP_VERTICAL_INTERVAL;
        });
      });
    } else {
      this._root.traverse(node => {
        this._renderNode(node);
        node.children.forEach((child) => {
          this._renderLink(node, child);
        });
      });
    }
    this._renderSelection();

    // invoke hook
    this._afterGraphRender();

    this._needsRerender = false;
    this._needsReposition = false;
  }

  // hook for subclasses to override
  protected _beforGraphRender() {}

  // hook for subclasses to override
  protected _afterGraphRender() {}

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
}