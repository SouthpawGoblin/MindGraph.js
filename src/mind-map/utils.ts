import { MapNodeType, MapLinkStyle, MapSelectionStyle } from "./types";
import { NodeStyle } from "../common/types";
import { MAP_NODE_STYLES, MAP_LINK_STYLE, MAP_SELECTION_STYLE } from "./constants";

function getChildNodeType(parentType: MapNodeType): MapNodeType {
  return parentType === 'root' ? 'primary' : 'secondary';
}

function getScaledNodeStyle(type: MapNodeType, scale: number): NodeStyle {
  const style = MAP_NODE_STYLES[type];
  return {
    ...style,
    fontSize: style.fontSize * scale,
    borderWidth: style.borderWidth * scale,
    borderRadius: style.borderRadius * scale,
    padding: style.padding * scale
  };
}

function getScaledLinkStyle(scale: number): MapLinkStyle {
  return {
    ...MAP_LINK_STYLE,
    lineWidth: MAP_LINK_STYLE.lineWidth * scale
  }
}

function getScaledSelectionStyle(scale: number): MapSelectionStyle {
  return {
    ...MAP_SELECTION_STYLE,
    padding: MAP_SELECTION_STYLE.padding * scale,
    outlineWidth: MAP_SELECTION_STYLE.outlineWidth * scale
  };
}

const _ = {
  getChildNodeType,
  getScaledNodeStyle,
  getScaledLinkStyle,
  getScaledSelectionStyle
};

export default _;