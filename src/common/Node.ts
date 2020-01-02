export default class Node {
  readonly id: number;
  text: string = '';
  parent: Node | null = null;
  children: Node[] = []

  constructor(id: number) {
    this.id = id;
  }
}