import { Injectable } from "@angular/core";
import { Firestore, collectionData, collection, doc, query, where, getDoc, DocumentData, getDocs, setDoc, deleteDoc, updateDoc } from "@angular/fire/firestore";
import { AppHelper } from "../models/AppHelper";
import { LearnModel, MemoCard } from "../models/Card";
import { Conspect } from "../models/Conspect";

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

    getItemsByUserName(userId: string | undefined, collectionName: string, mapFunc: Function) {
        const promise = new Promise((resolve, reject) => {
            if (!userId) {
                reject();
            }

            const usersRef = collection(this.firestore, collectionName);
            const q = query(usersRef, where("userId", "==", userId));

            getDocs(q).then(res => {
                let result = res.docs.map(x => mapFunc(x.id, x.data()));
                localStorage.setItem(collectionName, JSON.stringify(result));
                resolve(result);
            });
        });
        return promise;
    }

    // getMemoCardsByUserName(userId: string | undefined): Promise<any> {
    //     if (!userId) {
    //         let stringUser = localStorage.getItem('user');
    //         if (stringUser)
    //             userId = JSON.parse(stringUser);
    //     }

    //     let promise = new Promise((resolve, reject) => {

    //         const usersRef = collection(this.firestore, 'memoCards');
    //         const q = query(usersRef, where("userId", "==", userId));

    //         getDocs(q).then(res => {
    //             let result = res.docs.map(x => this.mapMemoCardModel(x.id, x.data()));
    //             localStorage.setItem("memoCards", JSON.stringify(result));
    //             resolve(result);
    //         });
    //     });
    //     return promise;
    // }

    async deleteMemoCardById(id: string): Promise<void> {
        return await deleteDoc(doc(this.firestore, "memoCards", id));
    }

    deleteItemById(id: string, collectionName: string): Promise<void> {
        return deleteDoc(doc(this.firestore, collectionName, id));
    }

    createNewMemoCard(model: MemoCard): Promise<any> {
        let objectToSave = JSON.parse(JSON.stringify(model));
        return setDoc(doc(this.firestore, "memoCards", AppHelper.generateGuid()), objectToSave);
    }

    createItem(model: any, collectionName: string): Promise<any> {
        let objectToSave = JSON.parse(JSON.stringify(model));
        return setDoc(doc(this.firestore, collectionName, AppHelper.generateGuid()), objectToSave);
    }

    updateItem(model: MemoCard, collectionName: string): Promise<void> {
        let objectToSave = JSON.parse(JSON.stringify(model));
        return setDoc(doc(this.firestore, collectionName, model.id), objectToSave);
    }

    async updateMemoCard(model: MemoCard): Promise<void> {
        if (!model || !model.id || !model.title)
            return;

        let objectToSave = JSON.parse(JSON.stringify(model));

        // return updateDoc(doc(this.firestore, "memoCards", cardId), {
        //     title: title
        // });
        return setDoc(doc(this.firestore, "memoCards", model.id), objectToSave);

    }

    async updateCardItemsById(model: MemoCard) {
        if (!model)
            return;

        return updateDoc(doc(this.firestore, "memoCards", model.id), {
            items: model.items
        });
    }

    async deleteConspectId(id: string): Promise<void> {
        return await deleteDoc(doc(this.firestore, "conspects", id));
    }

    async updateConspect(model: Conspect) {
        if (!model)
            return;

        let objectToSave = JSON.parse(JSON.stringify(model));
        return updateDoc(doc(this.firestore, "conspects", model.id), objectToSave);
    }

    async createConspect(model: Conspect) {
        if (!model)
            return;

        let objectToSave = JSON.parse(JSON.stringify(model));
        objectToSave.userId = AppHelper.currentUser.id;
        return setDoc(doc(this.firestore, "conspects", model.id), objectToSave);
    }


    async getConspects(userId: string): Promise<Array<Conspect>> {
        let promise = new Promise<Array<Conspect>>((resolve, reject) => {

            const usersRef = collection(this.firestore, 'conspects');
            const q = query(usersRef, where("userId", "==", userId));

            getDocs(q).then(res => {
                let result = res.docs.map(x => this.mapConspectModel(x.id, x.data()));
                AppHelper.setCachedConspects(result);
                resolve(result);
            });


            // const cahched = AppHelper.getCachedConspects();
            // if (cahched.success) {
            //     resolve(cahched.item);
            //     return;
            // }

            // const conspects: Array<any> = new Array<any>();

            // let conspect1 = new Conspect();
            // conspect1.id = AppHelper.generateGuid();
            // conspect1.tag = "Савельев";
            // conspect1.title = "С. Савельев Мне так же трудно как и другим";

            // let conspect2 = new Conspect();
            // conspect2.id = AppHelper.generateGuid();
            // conspect2.tag = "C#";
            // conspect2.title = "Dot Net Asp Net MVC";

            // conspects.push(conspect1);
            // conspects.push(conspect2);
            // AppHelper.setCachedConspects(conspects);
            // resolve(conspects);
        });
        return promise;
    }

    private mapUserModel(id: string, response: any): any {
        return {
            id: id,
            name: response.userName,
            isEnabled: response.isEnabled
        };
    }

    // private mapMemoCardModel(id: string, data: any): CardSet {
    //     if (!data.category)
    //         data.category = Category.Heap;

    //     let cardSet = new CardSet();

    //     cardSet.id = id;
    //     cardSet.category = data.category;
    //     cardSet.items = data.items;
    //     cardSet.title = data.title;
    //     cardSet.userId = data.userId;

    //     return cardSet;
    // }

    private mapConspectModel(id: string, data: any): Conspect {
        let model = new Conspect();

        model.id = id;
        model.html = data.html;
        model.tag = data.tag;
        model.title = data.title;
        return model;
    }
}