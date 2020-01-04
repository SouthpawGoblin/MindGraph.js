import { NodeType, NodeStyle } from "./types";
import { NODE_STYLES } from "./constants";

function getScaledNodeStyle(type: NodeType, scale: number): NodeStyle {
  const style = NODE_STYLES[type];
  return {
    ...style,
    fontSize: style.fontSize * scale,
    borderWidth: style.borderWidth * scale,
    borderRadius: style.borderRadius * scale,
    padding: style.padding * scale
  };
}

const _ = {
  getScaledNodeStyle
};

export default _;