import { Injectable } from "@angular/core";
import { Firestore, collectionData, collection, doc, query, where, getDoc, DocumentData, getDocs, setDoc, deleteDoc, updateDoc } from "@angular/fire/firestore";
import { AppHelper } from "../models/AppHelper";
import { CardModel, CardSet, Category } from "../models/Card";

@Injectable()
export class FirebaseDataProviderService {




    constructor(private firestore: Firestore) {
    }

    public getUserByName(userName: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const usersRef = collection(this.firestore, 'users');
            const q = query(usersRef, where("userName", "==", userName));

            getDocs(q).then(res => {
                if (res.docs.length === 0)
                    resolve(undefined);

                res.docs.forEach(doc => {
                    let user = doc.data();
                    if (user)
                        resolve(this.mapUserModel(doc.id, user));
                })
            });
        });
        return promise;
    }


    getMemoCardsByUserName(userId: string | undefined): Promise<any> {
        if (!userId) {
            let stringUser = localStorage.getItem('user');
            if (stringUser)
                userId = JSON.parse(stringUser);
        }

        let promise = new Promise((resolve, reject) => {

            const usersRef = collection(this.firestore, 'memoCards');
            const q = query(usersRef, where("userId", "==", userId));

            getDocs(q).then(res => {
                let result = res.docs.map(x => this.mapMemoCardModel(x.id, x.data()));
                localStorage.setItem("memoCardSets", JSON.stringify(result));
                resolve(result);
            });
        });
        return promise;
    }

    async deleteMemoCardById(id: string): Promise<void> {
        return await deleteDoc(doc(this.firestore, "memoCards", id));
    }

    createNewSet(model: CardSet) {
        let objectToSave = JSON.parse(JSON.stringify(model));
        setDoc(doc(this.firestore, "memoCards", AppHelper.generateGuid()), objectToSave);
    }


    async updateMemoCardSetTitleById(cardId: string, title: string): Promise<void> {
        if (!cardId || !title)
            return;

        return updateDoc(doc(this.firestore, "memoCards", cardId), {
            title: title
        });
    }

    async updateCardItemsById(model: CardSet) {
        if (!model)
            return;

        return updateDoc(doc(this.firestore, "memoCards", model.id), {
            items: model.items
        });
    }

    private mapUserModel(id: string, response: any): any {
        return {
            id: id,
            name: response.userName,
            isEnabled: response.isEnabled
        };
    }

    private mapMemoCardModel(id: string, data: any): CardSet {
        if (!data.category)
            data.category = Category.Heap;

        let cardSet = new CardSet();

        cardSet.id = id;
        cardSet.category = data.category;
        cardSet.items = data.items;
        cardSet.title = data.title;
        cardSet.userId = data.userId;

        return cardSet;
    }
}