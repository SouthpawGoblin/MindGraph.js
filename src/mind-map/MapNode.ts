import BasicNode from "../common/BasicNode";
import { MapNodeType } from "./types";
import { Size } from "../common/types";
import { MAP_NODE_STYLES } from "./constants";

export default class MapNode extends BasicNode {
  depth: number;
  parent: MapNode;
  children: MapNode[];
  private _type: MapNodeType;
  private _size: Size;
  private _verticalSpace: number;

  constructor(id: number, type: MapNodeType, depth: number, text?: string, comment?: string) {
    super(id, text, comment);
    this._type = type;
    this.depth = depth;
    this._updateSize();
    this._verticalSpace = this._size.height;
  }

  text(text?: string): string {
    if (typeof text !== 'undefined' && text !== this._text) {
      this._text = text;
      this._updateSize();
    }
    return this._text;
  }

  comment(comment?: string): string {
    if (typeof comment !== 'undefined' && comment !== this._comment) {
      this._comment = comment;
      this._updateSize();
    }
    return this._comment;
  }

  type(type?: MapNodeType): MapNodeType {
    if (typeof type !== 'undefined' && type !== this._type) {
      this._type = type;
      this._updateSize();
    }
    return this._type;
  }

  verticalSpace(height?: number) {
    if (typeof height !== 'undefined' && height !== this._verticalSpace) {
      this._verticalSpace = height;
    }
    return this._verticalSpace;
  }

  get size(): Size {
    return this._size;
  }

  private _updateSize() {
    const style = MAP_NODE_STYLES[this._type];
    const rulerCanvas = document.createElement('canvas');
    const ctx = rulerCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get rulerCanvas context 2d.');
    }
    // FIXME: need to consider multi-line situation
    ctx.font = `${style.fontStyle} normal ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    const textWidth = ctx.measureText(this._text).width;
    const textHeight = style.fontSize * 1.4;
    const pad = style.padding * 2 + style.borderWidth * 2;
    const boxWidth = textWidth + pad;
    const boxHeight = textHeight + pad;
    this._size = {
      width: boxWidth,
      height: boxHeight
    };
  }
}