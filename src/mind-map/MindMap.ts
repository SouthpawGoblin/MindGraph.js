import TreeNode from '../common/TreeNode';
import { NodeType, Vec2 } from './types';
import { getScaledNodeStyle } from './utils';

export class MindMapNode extends TreeNode {
  type: NodeType;

  constructor(id: number, type: NodeType, text?: string) {
    super(id, text);
    this.type = type;
  }

  render(ctx: CanvasRenderingContext2D, position: Vec2, scale: number) {
    const style = getScaledNodeStyle(this.type, scale);
    ctx.font = `${style.fontStyle} normal ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    const textWidth = ctx.measureText(this.text).width;
    const textHeight = style.fontSize * 1.4;
    const boxWidth = style.padding * 2 + textWidth;
    const boxHeight = style.padding * 2 + textHeight;
    const pos: Vec2 = {
      x: position.x * scale - boxWidth / 2,
      y: position.y * scale - boxHeight / 2
    };
    // TODO: support rounded rect
    ctx.beginPath();
    ctx.rect(pos.x, pos.y, boxWidth, boxHeight);
    ctx.closePath();
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
}

export default class MindMap {
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
    this.needsUpdate = true;
    this.renderLoop = true;
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

  render = () => {
    if (!this.renderLoop) {
      return;
    }
    this.innerRender();
    requestAnimationFrame(this.render);
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
    this.root.render(this.ctx, { x: 0, y: 0 }, this.scale);
    this.needsUpdate = false;
  }
}