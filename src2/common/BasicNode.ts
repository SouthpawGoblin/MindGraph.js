export default class BasicNode {
  readonly id: number;
  protected _text: string;
  protected _comment: string;

  constructor(id: number, text?: string, comment?: string) {
    this.id = id;
    this._text = text || '';
    this._comment = comment || '';
  }
}