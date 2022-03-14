import { FirebaseDataProviderService } from "../services/firebaseDataProvider.service";
import { OperationResult } from "./Base";
import { CardSet } from "./Card";
import { Conspect } from "./Conspect";
import { User } from "./User";

export class AppHelper {
    public static readonly conspectsKey = "conspects";

    public static updateCachedCardSet(cardSet: CardSet) {
        let cachedCardSetList = this.getLocalStorageCardSetList();

        for (let index = 0; index < cachedCardSetList.length; index++) {
            if (cachedCardSetList[index].id == cardSet.id) {
                cachedCardSetList[index] = cardSet;
                this.setCacheCardSetList(cachedCardSetList);
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

    public static setCacheCardSetList(array: Array<CardSet>) {
        localStorage.setItem("memoCardSets", JSON.stringify(array));
    }

    public static updateCachedConspect(conspect: Conspect) {
        let cached = this.getCachedConspects();
        if (!cached.success)
            throw "No cached data";

        for (let index = 0; index < cached.item.length; index++) {
            if (cached.item[index].id == conspect.id) {
                cached.item[index] = conspect;
                this.setCachedConspects(cached.item);
                return;
            }
        }
    }

    public static getCachedConspects(): OperationResult<Array<Conspect>> {
        let operation = new OperationResult(new Array<Conspect>());

        let cachedConspectList = localStorage.getItem(AppHelper.conspectsKey);

        if (cachedConspectList) {
            operation.item = JSON.parse(cachedConspectList);
            operation.success = true;
        }

        return operation;
    }

    public static setCachedConspects(array: Array<Conspect>) {
        localStorage.setItem(AppHelper.conspectsKey, JSON.stringify(array));
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

    public static syncData(db: FirebaseDataProviderService) {
        let user = AppHelper.currentUser;

        if (!user) {
            localStorage.removeItem('user');
            location.reload;
            return;
        }

        db.getMemoCardsByUserName(user?.id).then(response => {
            console.log("Firebase response");
            console.log(response);
            AppHelper.setCacheCardSetList(response);
            location.reload();
        });
    }

    public static get currentUser(): User {
        let modelInLocalStorage = localStorage.getItem('user');

        if (!modelInLocalStorage)
            throw "User not found!";

        let model = (JSON.parse(modelInLocalStorage) as User);
        return model;
    }
}