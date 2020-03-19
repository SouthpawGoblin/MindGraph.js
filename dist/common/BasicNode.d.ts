export default class BasicNode {
    readonly id: number;
    protected _text: string;
    protected _comment: string;
    constructor(id: number, text?: string, comment?: string);
}
