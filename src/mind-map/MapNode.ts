import BasicNode from "../common/BasicNode";
import { MapNodeType } from "./types";
import { Size, Vec2 } from "../common/types";
import { MAP_NODE_STYLES } from "./constants";

export default class MapNode extends BasicNode {
  depth: number;
  parent: MapNode | null;
  children: MapNode[];
  private _type: MapNodeType;
  private _size: Size;
  private _treeSpace: Size;
  private _position: Vec2;
  private _selected: boolean;

  constructor(id: number, type: MapNodeType, depth: number, text?: string, comment?: string) {
    super(id, text, comment);
    this.parent = null;
    this.children = [];
    this._type = type;
    this.depth = depth;
    this._size = { w: 0, h: 0 };
    this._updateSize();
    this._treeSpace = {
      w: this._size.w,
      h: this._size.h
    };
    this._position = { x: 0, y: 0 };
    this._selected = false;
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

  treeSpace(space?: Size) {
    if (typeof space !== 'undefined' && (space.w !== this._treeSpace.w || space.h !== this._treeSpace.h)) {
      this._treeSpace = {
        w: space.w,
        h: space.h
      };
    }
    return {
      w: this._treeSpace.w,
      h: this._treeSpace.h
    };
  }

  position(pos?: Vec2) {
    if (typeof pos !== 'undefined' && (pos.x !== this._position.x || pos.y !== this._position.y)) {
      this._position = {
        x: pos.x,
        y: pos.y
      };
    }
    return {
      x: this._position.x,
      y: this._position.y
    };
  }

  selected(flag?: boolean) {
    if (typeof flag !== 'undefined') {
      this._selected = flag;
    }
    return this._selected;
  }

  get size(): Size {
    return this._size;
  }

  clone(): MapNode {
    const clonedNode: MapNode = new MapNode(this.id, this._type, this.depth, this._text, this._comment);
    clonedNode.children = [];
    clonedNode.parent = null;
    this.children.forEach(child => {
      const clonedChild = child.clone();
      clonedChild.parent = clonedNode;
      clonedNode.children.push(clonedChild);
    });
    return clonedNode;
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
      w: boxWidth,
      h: boxHeight
    };
  }
}