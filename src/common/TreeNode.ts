export default class TreeNode {
  readonly id: number;
  text: string;
  parent: TreeNode | null = null;
  children: TreeNode[] = []

  constructor(id: number, text?: string) {
    this.id = id;
    this.text = text || ''
  }
}