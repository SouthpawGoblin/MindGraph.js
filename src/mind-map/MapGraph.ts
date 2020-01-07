import MapNode from "./MapNode";
import { Vec2 } from "../common/types";
import BasicCanvasControl from "../common/BasicCanvasControl";
import _ from './utils';
import { MapNodeType } from "./types";
import { MAP_VERTICAL_INTERVAL } from "./constants";

interface NodeInfo {
  node: MapNode,
  pos: Vec2
}

export default class MapGraph {
  private _root: MapNode;
  private _nodeIndex: { [key: number]: MapNode };
  private _parentDom: HTMLElement;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _center: Vec2;
  private _scale: number;
  private _translate: Vec2;
  private _needsUpdate: boolean;
  private _renderLoop: boolean;
  private _control: BasicCanvasControl | null;

  private static nextNodeId: number = 0;

  constructor(dom: HTMLElement) {
    this._parentDom = dom;
    this._root = new MapNode(MapGraph.nextNodeId++, 'root', 0, 'Main Theme');
    this._nodeIndex[this._root.id] = this._root;
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
    this._needsUpdate = true;
    this._renderLoop = true;
    // TODO: control
  }

  scale(scale?: number): number {
    if (typeof scale !== 'undefined' && scale !== this._scale) {
      this._scale = scale;
      this._needsUpdate = true;
    }
    return this._scale;
  }

  translate(translate?: Vec2): Vec2 {
    if (typeof translate !== 'undefined' && translate.x !== this._translate.x && translate.y !== this._translate.y) {
      this._translate = translate;
      this._needsUpdate = true;
    }
    return this._translate;
  }

  // returns added node's id
  addNode(parentId: number, text?: string): number {
    const parent = this._nodeIndex[parentId];
    if (!parent) {
      throw new Error('"addNode" failed, parent node not found.');
    }
    const nodeType: MapNodeType = parent.type() === 'root' ? 'primary' : 'secondary';
    const node = new MapNode(MapGraph.nextNodeId++, nodeType, parent.depth + 1, text);
    parent.children.push(node);
    node.parent = parent;
    this._traceBackUpdateVerticalSpaces(parent, node.verticalSpace() + MAP_VERTICAL_INTERVAL);
    this._nodeIndex[node.id] = node;
    this._needsUpdate = true;
    return node.id;
  }

  // returns deleted node's parent id
  deleteNode(nodeId: number): number {
    const node = this._nodeIndex[nodeId];
    // ROOT node cannot be deleted
    if (!node || node.type() === 'root') {
      return -1;
    }
    const idx = node.parent.children.findIndex(child => child.id === nodeId);
    node.parent.children.splice(idx, 1);
    this._traceBackUpdateVerticalSpaces(node.parent, -(node.verticalSpace() + MAP_VERTICAL_INTERVAL));
    delete this._nodeIndex[nodeId];
    this._needsUpdate = true;
    return node.parent.id;
  }

  updateNode(nodeId: number, text: string) {
    const node = this._nodeIndex[nodeId];
    if (!node) {
      throw new Error('"updateNode" failed, node not found.');
    }
    const originalVerticalSpace = node.verticalSpace();
    node.text(text);
    const deltaSpace = node.verticalSpace() - originalVerticalSpace;
    this._traceBackUpdateVerticalSpaces(node.parent, deltaSpace);
    this._needsUpdate = true;
  }

  dispose() {
    this._renderLoop = false;
    this._control.dispose();
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
    if (!this._needsUpdate) {
      return;
    }
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.translate(
      this._center.x + this._translate.x,
      this._center.y + this._translate.y
    );
    // BFS node tree rendering
    const nodeInfos: NodeInfo[] = [{
      node: this._root,
      pos: { 
        x: -this._root.size.width / 2, 
        y: -this._root.size.height / 2
      }
    }];
    while (nodeInfos.length > 0) {
      const info = nodeInfos.shift();
      this._renderNode(info);
      info.node.children.forEach(child => {
        // TODO: parent's vertical space is children's total space
        this._renderLink(info, child);
        nodeInfos.push(child);
      });
    }
    this._needsUpdate = false;
  }

  private _renderNode(info: NodeInfo) {
    const style = _.getScaledNodeStyle(info.node.type(), this._scale);
    const ctx = this._ctx;
    // TODO: support rounded rect
    ctx.beginPath();
    ctx.rect(pos.x, pos.y, boxWidth, boxHeight);
    ctx.fillStyle = style.background;
    ctx.fill();
    if (style.borderWidth > 0) {
      ctx.strokeStyle = style.borderColor;
      ctx.lineWidth = style.borderWidth; 
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.fillStyle = style.color;
    ctx.fillText(this.text, pos.x + style.padding, pos.y + style.padding + style.fontSize);
  }

  private _renderLink(node1: MapNode, node2: MapNode) {

  }

  private _traceBackUpdateVerticalSpaces(node: MapNode, spaceDelta: number) {
    let current = node;
    while(current) {
      current.verticalSpace(current.verticalSpace() + spaceDelta);
      current = current.parent;
    }
  }
}