import TreeNode from "../common/TreeNode";
import { NodeType, Vec2 } from "../common/types";
import _ from "../common/utils";

export default class MindMapNode extends TreeNode {
  type: NodeType;

  constructor(id: number, depth: number, type: NodeType, text?: string) {
    super(id, depth, text);
    this.type = type;
  }

  render(ctx: CanvasRenderingContext2D, position: Vec2, scale: number) {
    const style = _.getScaledNodeStyle(this.type, scale);
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