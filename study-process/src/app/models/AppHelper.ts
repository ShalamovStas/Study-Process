import { CardSet } from "./Card";

export class AppHelper {
    public static updateCachedCardSet(cardSet: CardSet) {

        let cachedCardSetList = this.getLocalStorageCardSetList();

        for (let index = 0; index < cachedCardSetList.length; index++) {
            if (cachedCardSetList[index].id == cardSet.id) {
                cachedCardSetList[index] = cardSet;
                this.cacheCardSetList(cachedCardSetList);
                return;
            }
        }
    }

    public static getLocalStorageCardSetList(): Array<CardSet> {
        let cardSetList;
        let cachedCards = localStorage.getItem("memoCardSets");

        if (cachedCards)
            cardSetList = JSON.parse(cachedCards);

        return cardSetList;
    }

    public static cacheCardSetList(array: Array<CardSet>){
        localStorage.setItem("memoCardSets", JSON.stringify(array));
    }

    public static generateGuid() {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    }
}