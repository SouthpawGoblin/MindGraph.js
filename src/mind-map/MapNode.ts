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

  constructor(id: number, type: MapNodeType, depth: number, text?: string, comment?: string) {
    text = text || 'New';
    super(id, text, comment);
    this.parent = null;
    this.children = [];
    this._type = type;
    this.depth = depth;
    this._size = { w: 0, h: 0 };
    this._updateSize();
    this._treeSpace = Object.assign({}, this._size);
    this._position = { x: 0, y: 0 };
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
      this._treeSpace = Object.assign({}, space);
    }
    return Object.assign({}, this._treeSpace);
  }

  position(pos?: Vec2) {
    if (typeof pos !== 'undefined' && (pos.x !== this._position.x || pos.y !== this._position.y)) {
      this._position = Object.assign({}, pos);
    }
    return Object.assign({}, this._position);
  }

  size(size?: Size): Size {
    if (typeof size !== 'undefined' && (size.w !== this._size.w || size.h !== this._size.h)) {
      this._size = Object.assign({}, size);
    }
    return Object.assign({}, this._size);
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

  traverse(callback: (node: MapNode) => void) {
    const nodes: MapNode[] = [this];
    while (nodes.length > 0) {
      const node = nodes.shift() as MapNode;
      callback && callback(node);
      node.children.forEach((child) => {
        nodes.push(child);
      });
    }
  }

  isDescendentOf(node: MapNode): boolean {
    let currentNode: MapNode | null = this;
    let result = false;
    while (currentNode) {
      if (currentNode.id === node.id) {
        result = true;
        break;
      }
      currentNode = currentNode.parent;
    }
    return result;
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