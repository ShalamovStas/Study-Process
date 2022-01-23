export class CardSet {
    id: string = '';
    userId: string = '';
    title: string = '';
    items: Array<CardModel> = [];
}

export class CardModel {
    id: string = '';
    frontSide: string = '';
    backSide: string = '';
    inUse: boolean = false;
}