import TreeNode from '../common/TreeNode';
import { NodeType, Vec2 } from './types';
import { NODE_STYLES } from './constants';

export class MindMapNode extends TreeNode {
  type: NodeType;

  constructor(id: number, type: NodeType, text?: string) {
    super(id, text);
    this.type = type;
  }

  render(ctx: CanvasRenderingContext2D, position: Vec2) {
    const style = NODE_STYLES[this.type];
    ctx.font = `${style.fontStyle} normal ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    const textWidth = ctx.measureText(this.text).width;
    const textHeight = style.fontSize * 1.4;
    const boxWidth = style.padding * 2 + textWidth;
    const boxHeight = style.padding * 2 + textHeight;
    // TODO: support rounded rect
    ctx.rect(position.x, position.y, boxWidth, boxHeight);
    ctx.fillStyle = style.background;
    ctx.fill();
    if (style.borderWidth > 0) {
      ctx.strokeStyle = style.borderColor;
      ctx.lineWidth = style.borderWidth; 
      ctx.stroke();
    }
    ctx.fillStyle = style.color;
    ctx.fillText(this.text, position.x + style.padding, position.y + style.padding + style.fontSize);
  }
}

export default class MindMap {
  private root: MindMapNode;
  private index: { [key: number]: MindMapNode } = {};
  private parentDom: HTMLElement;
  private canvas: HTMLCanvasElement;
  
  private static nextId: number = 0;

  constructor(parentDom: HTMLElement, root?: MindMapNode) {
    this.parentDom = parentDom;
    this.root = root || new MindMapNode(MindMap.nextId++, 'ROOT', 'Main Theme');
    this.index[this.root.id] = this.root;
    const canvas = document.createElement('canvas');
    canvas.id = 'mind-graph-mind-map';
    canvas.width = this.parentDom.clientWidth;
    canvas.height = this.parentDom.clientHeight;
    this.parentDom.appendChild(canvas);
    this.canvas = canvas;
  }

  render() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    this.root.render(ctx, { x: 10, y: 10 });
  }
}