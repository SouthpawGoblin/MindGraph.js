import { NodeType, NodeStyle, LinkStyle } from "./types";
import { NODE_STYLES, LINK_STYLE } from "./constants";
import TreeNode from "./TreeNode";

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

function getScaledLinkStyle(scale: number): LinkStyle {
  return {
    ...LINK_STYLE,
    lineWidth: LINK_STYLE.lineWidth * scale
  }
}

function getTreeDepth(root: TreeNode): number {
  const leafDepths: number[] = [];
  traverseLeaves(root, leafDepths);
  return Math.max(...leafDepths);

  function traverseLeaves(node: TreeNode, depths: number[]) {
    if (node.children.length === 0) {
      depths.push(node.depth);
    } else {
      node.children.forEach((child: TreeNode) => traverseLeaves(child, depths));
    }
  }
}

const _ = {
  getScaledNodeStyle,
  getScaledLinkStyle,
  getTreeDepth
};

export default _;