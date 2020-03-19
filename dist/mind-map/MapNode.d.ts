import BasicNode from "../common/BasicNode";
import { MapNodeType } from "./types";
import { Size, Vec2 } from "../common/types";
export default class MapNode extends BasicNode {
    depth: number;
    parent: MapNode | null;
    children: MapNode[];
    private _type;
    private _size;
    private _treeSpace;
    private _position;
    constructor(id: number, type: MapNodeType, depth: number, text?: string, comment?: string);
    text(text?: string): string;
    comment(comment?: string): string;
    type(type?: MapNodeType): MapNodeType;
    treeSpace(space?: Size): Size;
    position(pos?: Vec2): Vec2;
    size(size?: Size): Size;
    clone(): MapNode;
    traverse(callback: (node: MapNode) => void): void;
    isDescendentOf(node: MapNode): boolean;
    private _updateSize;
}
