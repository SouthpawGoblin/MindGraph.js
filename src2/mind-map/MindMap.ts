import { NodeType, Vec2 } from '../common/types';
import Graph from '../common/Graph';
import CanvasControl from '../common/CanvasControl';
import MindMapNode from './MindMapNode';
import TreeNode from '../common/TreeNode';
import _ from '../common/utils';

export default class MindMap implements Graph {
  private root: MindMapNode;
  private index: { [key: number]: MindMapNode } = {};
  private parentDom: HTMLElement;
  private canvas: HTMLCanvasElement;
  private center: Vec2;
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private translate: Vec2;
  private needsUpdate: boolean;
  private renderLoop: boolean;
  private control: CanvasControl;
  private treeDepth: number;
  
  private static nextId: number = 0;

  constructor(parentDom: HTMLElement, root?: MindMapNode) {
    this.parentDom = parentDom;
    this.root = root || new MindMapNode(MindMap.nextId++, 0, 'ROOT', 'Main Theme');
    this.index[this.root.id] = this.root;
    const canvas = document.createElement('canvas');
    canvas.id = 'mind-graph-mind-map';
    canvas.width = this.parentDom.clientWidth;
    canvas.height = this.parentDom.clientHeight;
    this.parentDom.appendChild(canvas);
    this.canvas = canvas;
    this.center = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context 2d.');
    }
    this.ctx = ctx;
    this.scale = 1;
    this.translate = { x: 0, y: 0 };
    this.control = new CanvasControl(this);
    this.treeDepth = this.root.depth;
    this.needsUpdate = true;
    this.renderLoop = true;
  }

  get rootId(): number {
    return this.root.id;
  }

  getCanvas() {
    return this.canvas;
  }

  getScale() {
    return this.scale;
  }

  getTranslate() {
    return this.translate;
  }

  setScale(scale: number) {
    if (scale !== this.scale) {
      this.scale = scale;
      this.needsUpdate = true;
    }
  }

  setTranslate(translate: Vec2) {
    if (this.translate.x !== translate.x || this.translate.y !== translate.y) {
      this.translate = translate;
      this.needsUpdate = true;
    }
  }

  // returns added node's id
  addNode(parentId: number, text?: string): number {
    const parent = this.index[parentId];
    if (!parent) {
      throw new Error('"addNode" failed, parent node not found.');
    }
    const nodeType: NodeType = parent.type === 'ROOT' ? 'PRIMARY' : 'SECONDARY';
    const node = new MindMapNode(MindMap.nextId++, parent.depth + 1, nodeType, text);
    parent.children.push(node);
    node.parent = parent;
    this.index[node.id] = node;
    this.treeDepth = Math.max(this.treeDepth, node.depth);
    this.needsUpdate = true;
    return node.id;
  }

  // returns deleted node's parent id
  deleteNode(nodeId: number): number {
    const node = this.index[nodeId];
    // ROOT node cannot be deleted
    if (!node || !node.parent) {
      return -1;
    }
    const idx = node.parent.children.findIndex(child => child.id === nodeId);
    node.parent.children.splice(idx, 1);
    delete this.index[nodeId];
    this.treeDepth = _.getTreeDepth(this.root);
    this.needsUpdate = true;
    return node.parent.id;
  }

  updateNode(nodeId: number, text: string) {
    const node = this.index[nodeId];
    if (!node) {
      throw new Error('"updateNode" failed, node not found.');
    }
    node.text = text;
    this.needsUpdate = true;
  }

  render = () => {
    if (!this.renderLoop) {
      return;
    }
    this.innerRender();
    requestAnimationFrame(this.render);
  }

  dispose() {
    this.renderLoop = false;
    this.control.dispose();
    this.canvas.remove();
  }

  private innerRender() {
    if (!this.needsUpdate) {
      return;
    }
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(
      this.center.x + this.translate.x,
      this.center.y + this.translate.y
    );
    // BFS node tree rendering
    let nodePos: Vec2 = { x: 0, y: 0 };
    const deltaX = 200;
    const deltaY = -100;
    const nodes: TreeNode[] = [this.root];
    while (nodes.length > 0) {
      const node = nodes.shift();
      if (node) {
        (node as MindMapNode).render(this.ctx, {
          // TODO: calculate node position
          x: nodePos.x + node.depth * deltaX,
          y: nodePos.y + node.depth * deltaY
        }, this.scale);
        node.children.forEach(child => {
          nodes.push(child);
        });
      }
    }
    this.needsUpdate = false;
  }
}