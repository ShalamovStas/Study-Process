import { Injectable } from "@angular/core";
import { AppHelper } from "../models/AppHelper";
import { CardModel, CardSet } from "../models/Card";

@Injectable()
export class ImportCardSetService {

    //to keep smth handy - держать что-то под рукой;look after someone - присматривать за кем-то, заботиться;
    parseCardSet(importModel: CardSetImportModel): CardSet | undefined {
        if (!importModel.isValid)
            return;

        let user = AppHelper.currentUser;

        if (!user) {
            return;
        }

        let cardSet = new CardSet();
        cardSet.userId = user?.id;
        cardSet.title = importModel.title;

        let cardItemsParsed = importModel.text.split(importModel.itemsSeparator);

        cardItemsParsed.forEach(cardItem => {

            let cardModel = new CardModel();

            let backAndFront = cardItem.split(importModel.cardModelSeparator);

            if (backAndFront && backAndFront[0] && backAndFront[1]) {
                cardModel.frontSide = backAndFront[0];
                cardModel.backSide = backAndFront[1];
                cardSet.items.push(cardModel);
            }
        });

        return cardSet;
    }
}

export class CardSetImportModel {
    text: string = "";
    title: string = "";

    itemsSeparator: string = "";
    cardModelSeparator: string = "";

    get isValid(): boolean {
        return this.cardModelSeparator !== this.itemsSeparator;
    }
}