import { MapNodeType, MapLinkStyle } from "./types";
import { NodeStyle } from "../common/types";
import { MAP_NODE_STYLES, MAP_LINK_STYLE } from "./constants";
import MapGraph from "./MapGraph";

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

const _ = {
  getScaledNodeStyle,
  getScaledLinkStyle
};

export default _;