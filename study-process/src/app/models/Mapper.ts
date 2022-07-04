import { MemoCard, MemoCardCategory } from "./Card";

export class Mapper {

    public static mapMemoCardCategories(id: string, data: any): MemoCardCategory {
        const category = new MemoCardCategory();

        Object.assign(category, data);
        category.id = id;

        return category;
    }

    public static mapMemoCardModel(id: string, data: any): MemoCard {
        let cardSet = new MemoCard();

        Object.assign(cardSet, data);
        cardSet.id = id;

        return cardSet;
    }

}
