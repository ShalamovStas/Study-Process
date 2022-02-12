import { AppHelper } from "./AppHelper";

export enum Category {
    Heap = 0,
    English = 1,
    Programming = 2,
    Other = 10
}

export class CardSet {
    id: string = AppHelper.generateGuid();
    userId: string = '';
    title: string = '';
    items: Array<CardModel> = [];
    category: Category = Category.Heap
}

export class CardModel {
    id: string = AppHelper.generateGuid();
    frontSide: string = '';
    backSide: string = '';
    inUse: boolean = true;
}