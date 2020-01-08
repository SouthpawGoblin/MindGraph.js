import { NodeStyle, LinkStyle } from "../common/types";

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