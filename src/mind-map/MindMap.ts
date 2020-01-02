import Node from '../common/Node';

export class MindMapNode extends Node {
  constructor(id: number) {
    super(id);
  }

  render(ctx: CanvasRenderingContext2D) {

  }
}

export default class MindMap {
  root: Node;
  index: { [key: number]: Node } = {};
  
  private static nextId: number = 0;

  constructor(root: Node | undefined) {
    this.root = root || new Node(MindMap.nextId++);
    this.index[this.root.id] = this.root;
  }

  render(ctx: CanvasRenderingContext2D) {

  }
}