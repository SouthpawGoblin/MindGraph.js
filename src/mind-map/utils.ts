import { MapNodeType, MapLinkStyle, MapSelectionStyle, MapNodeStyle } from "./types";
import { MAP_NODE_STYLES, MAP_LINK_STYLE, MAP_SELECTION_STYLE, MAP_INSERT_MARK_STYLE } from "./constants";
import { InsertMarkStyle } from "../common/types";

function getChildNodeType(parentType: MapNodeType): MapNodeType {
  return parentType === 'root' ? 'primary' : 'secondary';
}

function getScaledNodeStyle(type: MapNodeType, scale: number): MapNodeStyle {
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

function getScaledInsertMarkStyle(scale: number): InsertMarkStyle {
  return {
    ...MAP_INSERT_MARK_STYLE,
    width: MAP_INSERT_MARK_STYLE.width * scale,
    height: MAP_INSERT_MARK_STYLE.height * scale
  };
}

const _ = {
  getChildNodeType,
  getScaledNodeStyle,
  getScaledLinkStyle,
  getScaledSelectionStyle,
  getScaledInsertMarkStyle
};

export default _;