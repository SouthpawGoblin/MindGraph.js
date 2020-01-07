import BasicNode from "../common/BasicNode";
import { NodeType, Vec2, Rect } from "../common/types";
import _ from "../common/utils";

export default class MindMapNode extends BasicNode {
  readonly depth: number;
  parent: MindMapNode;
  children: MindMapNode[];
  type: NodeType;
  relPos: Vec2;
  boundingBox: Rect;
  leftHookPos: Vec2;
  rightHookPos: Vec2;

  constructor(id: number, depth: number, type: NodeType, text?: string) {
    super(id, depth, text);
    this.type = type;
    this.boundingBox = { x: 0, y: 0, width: 0, height: 0 };
    this.leftHookPos = { x: 0, y: 0 };
    this.rightHookPos = { x: 0, y: 0 };
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
    const halfBorderWidth = style.borderWidth / 2;
    this.boundingBox = {
      x: pos.x - halfBorderWidth,
      y: pos.y - halfBorderWidth,
      width: boxWidth + style.borderWidth,
      height: boxHeight + style.borderWidth
    };
    this.leftHookPos = {
      x: this.boundingBox.x,
      y: this.boundingBox.y + this.boundingBox.height / 2
    };
    this.rightHookPos = {
      x: this.boundingBox.x + this.boundingBox.width,
      y: this.boundingBox.y + this.boundingBox.height / 2
    };

    // render node box
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

    // render node link to parent
    if (this.parent) {
      const linkStyle = _.getScaledLinkStyle(scale);
      const parent = this.parent as MindMapNode;
      const deltaX = this.leftHookPos.x - parent.rightHookPos.x;
      ctx.beginPath();
      ctx.moveTo(parent.rightHookPos.x, parent.rightHookPos.y);
      ctx.bezierCurveTo(
        parent.rightHookPos.x + linkStyle.cp1Ratio * deltaX, 
        parent.rightHookPos.y,
        parent.rightHookPos.x + linkStyle.cp2Ratio * deltaX,
        this.leftHookPos.y,
        this.leftHookPos.x,
        this.leftHookPos.y  
      );
      ctx.lineWidth = linkStyle.lineWidth;
      ctx.strokeStyle = linkStyle.lineColor;
      ctx.stroke();
    }
  }
}