import { NodeStyle, LinkStyle, SelectionStyle } from "../common/types";
export declare type MapNodeType = 'root' | 'primary' | 'secondary';
export interface MapNodeStyle extends NodeStyle {
    draggingColor: string;
    draggingBackground: string;
    draggingBorderColor: string;
}
export interface MapNodeStyles {
    root: MapNodeStyle;
    primary: MapNodeStyle;
    secondary: MapNodeStyle;
}
export interface MapLinkStyle extends LinkStyle {
    cp1Ratio: number;
    cp2Ratio: number;
}
export interface MapSelectionStyle extends SelectionStyle {
}
export interface MapNodeInfo {
    id: number;
    text: string;
    comment: string;
    parentId: number;
    childrenId: number[];
}
export interface MapJson {
    rootId: number;
    [key: number]: MapNodeInfo;
}
