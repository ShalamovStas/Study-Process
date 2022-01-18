import { Injectable } from "@angular/core";
import { Firestore, collectionData, collection, doc, query, where, getDoc, DocumentData, getDocs } from "@angular/fire/firestore";

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
                        resolve(user);
                })
            });
        });
        return promise;
    }
}