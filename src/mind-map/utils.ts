import { MapNodeType, MapLinkStyle } from "./types";
import { NodeStyle } from "../common/types";
import { MAP_NODE_STYLES, MAP_LINK_STYLE } from "./constants";

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

// function getTreeDepth(root: TreeNode): number {
//   const leafDepths: number[] = [];
//   traverseLeaves(root, leafDepths);
//   return Math.max(...leafDepths);

//   function traverseLeaves(node: TreeNode, depths: number[]) {
//     if (node.children.length === 0) {
//       depths.push(node.depth);
//     } else {
//       node.children.forEach((child: TreeNode) => traverseLeaves(child, depths));
//     }
//   }
// }

const _ = {
  getScaledNodeStyle,
  getScaledLinkStyle
  // getTreeDepth
};

export default _;