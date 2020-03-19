import BasicMapGraph from "./BasicMapGraph";
import { Vec2 } from "../common/types";
/**
 * BasicMapGraph with canvas interactions
 */
export default class MapGraph extends BasicMapGraph {
    protected _mouseLeftDragging: boolean;
    protected _mouseLeftStartPos: Vec2;
    protected _mouseRightDragging: boolean;
    protected _mouseRightStartPos: Vec2;
    protected _draggingNodeId: number;
    protected _targetNodeId: number;
    constructor(dom: HTMLElement);
    dispose(): void;
    private _registerInteractions;
    private _unregisterInteractions;
    private _handleWheel;
    private _handleMouseDown;
    private _handleMouseMove;
    private _handleMouseUp;
    private _handleMouseLeave;
    private _handleDoubleClick;
    private _handleKeyUp;
    private _handleContextMenu;
    private _getNodeAtPosition;
    private _renderInput;
    private _renderInsertMark;
}
