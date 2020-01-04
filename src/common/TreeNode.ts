export default class TreeNode {
  readonly id: number;
  readonly depth: number;
  text: string;
  parent: TreeNode | null = null;
  children: TreeNode[] = []

  constructor(id: number, level: number, text?: string) {
    this.id = id;
    this.depth = level;
    this.text = text || ''
  }
}