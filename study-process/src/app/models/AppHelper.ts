import { FirebaseDataProviderService } from "../services/firebaseDataProvider.service";
import { OperationResult } from "./Base";
import { MemoCard } from "./Card";
import { Conspect } from "./Conspect";
import { User } from "./User";

export class AppHelper {
    public static readonly conspectsKey = "conspects";
    public static windowWidthPoint = 1200;

    public static updateCachedCardSet(cardSet: MemoCard) {
        let cachedCardSetList = this.getCachedCardSetList();

        for (let index = 0; index < cachedCardSetList.length; index++) {
            if (cachedCardSetList[index].id == cardSet.id) {
                cachedCardSetList[index] = cardSet;
                this.setCacheCardSetList(cachedCardSetList);
                return;
            }
        }
    }

    public static getCachedCardSetList(): Array<MemoCard> {
        let cardSetList;
        let cachedCards = localStorage.getItem("memoCards");

        if (cachedCards)
            cardSetList = JSON.parse(cachedCards);

        return cardSetList;
    }

    public static setCacheCardSetList(array: Array<MemoCard>) {
        localStorage.setItem("memoCards", JSON.stringify(array));
    }

    public static setCache(object: any, key: string) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    public static getCache(key: string): any {
        let result;
        let cached = localStorage.getItem(key);

        if (cached)
            result = JSON.parse(cached);

        return result;
    }

    public static updateCachedConspect(conspect: Conspect) {
        let cached = this.getCachedConspects();
        if (!cached.success)
            throw "No cached data";

        for (let index = 0; index < cached.result.length; index++) {
            if (cached.result[index].id == conspect.id) {
                cached.result[index] = conspect;
                this.setCachedConspects(cached.result);
                return;
            }
        }
    }

    public static getCachedConspects(): OperationResult<Array<Conspect>> {
        let operation = new OperationResult(new Array<Conspect>());

        let cachedConspectList = localStorage.getItem(AppHelper.conspectsKey);

        if (cachedConspectList) {
            operation.result = JSON.parse(cachedConspectList);
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

    public static get currentUser(): User {
        let modelInLocalStorage = localStorage.getItem('user');

        if (!modelInLocalStorage)
            return new User();

        let model = (JSON.parse(modelInLocalStorage) as User);
        return model;
    }

    static get isDesktop(): boolean {
        return window.innerWidth >= AppHelper.windowWidthPoint;
    }
}