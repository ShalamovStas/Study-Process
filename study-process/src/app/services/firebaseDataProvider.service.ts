import { Injectable } from "@angular/core";
import { Firestore, collectionData, collection, doc, query, where, getDoc, DocumentData, getDocs, setDoc } from "@angular/fire/firestore";

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
                        resolve(this.getUserModel(doc.id, user));
                })
            });
        });
        return promise;
    }

    getMemoCardsByUserName(userId: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {

            const usersRef = collection(this.firestore, 'memoCards');
            const q = query(usersRef, where("userId", "==", userId));

            getDocs(q).then(res => {
                resolve(res.docs.map(x => x.data()));
            });
        });
        return promise;
    }

    createNewDeck(deckModel: { title: string; items: never[]; userId: any; }) {
        setDoc(doc(this.firestore, "memoCards", this.generateGuid()), deckModel);
    }

    private getUserModel(id: string, response: any): any {
        return {
            id: id,
            name: response.userName,
            isEnabled: response.isEnabled
        };
    }

    private generateGuid() {
        var result, i, j;
        result = '';
        for(j=0; j<32; j++) {
          if( j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
          i = Math.floor(Math.random()*16).toString(16).toUpperCase();
          result = result + i;
        }
        return result;
      }

}