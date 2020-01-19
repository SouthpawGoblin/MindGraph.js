import { NodeStyle, LinkStyle, SelectionStyle } from "../common/types";

export type MapNodeType = 'root' | 'primary' | 'secondary';

export interface MapNodeStyles {
  root: NodeStyle,
  primary: NodeStyle,
  secondary: NodeStyle
}

export interface MapLinkStyle extends LinkStyle {
  cp1Ratio: number;
  cp2Ratio: number;
}

export interface MapSelectionStyle extends SelectionStyle {}

export interface MapNodeInfo {
  id: number;
  text: string;
  comment: string;
  parentId: number | null;
  childrenId: number[];
}

export interface MapJson {
  rootId: number;
  [key: number]: MapNodeInfo
}