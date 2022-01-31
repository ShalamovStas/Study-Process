import { Injectable } from "@angular/core";
import { CardModel } from "../models/Card";

@Injectable()
export class StepperService<T> {
    public isReady = false;
    public items: Array<T> = [];

    public currentStepIndex: number = 0;

    public currentItem: T | undefined;

    public currentProgressPers = 0;

    init(items: Array<T>) {
        this.items = items;
        this.currentItem = this.items[this.currentStepIndex];
        this.isReady = true;
    }

    getCurrentStep() {
        this.currentItem = this.items[this.currentStepIndex];
        this.currentProgressPers = this.currentStepIndex * 100 / (this.items.length - 1);
        return this.items[this.currentStepIndex];
    }

    getNextStep(): T {
        this.currentStepIndex++;
        if (this.items.length === this.currentStepIndex)
            this.currentStepIndex = 0;

        return this.getCurrentStep();
    }

    getPreviousStep(): T {
        this.currentStepIndex--;
        if (this.currentStepIndex < 0)
            this.currentStepIndex = this.items.length - 1;

        return this.getCurrentStep();
    }
}

export enum MemoCardSide {
    Front,
    Back
}

export class StepperServiceExeA {
    private currentCard: CardModel = new CardModel();

    private lastIndex: number = 0;
    currentCardSide = MemoCardSide.Front;

    constructor(private items: Array<CardModel>) {
        this.currentCardSide = MemoCardSide.Front;
        this.currentCard = items[0];
        this.next;
    }

    get currentItem(): string {
        if (this.currentCardSide === MemoCardSide.Front) {
            return this.currentCard.frontSide;
        }

        if (this.currentCardSide === MemoCardSide.Back) {
            return this.currentCard.backSide;
        }

        return "";
    }

    get next(): string {
        if (this.currentCardSide === MemoCardSide.Front) {
            this.currentCardSide = MemoCardSide.Back;
            return this.currentCard.backSide;
        }

        if (this.currentCardSide === MemoCardSide.Back) {

            let index = this.getRandomIntInclusive(0, this.items.length);
            if (index === this.lastIndex)
                index = this.getRandomIntInclusive(0, this.items.length);

            this.lastIndex = index;

            this.currentCard = this.items[index];
            this.currentCardSide = MemoCardSide.Front;

            return this.currentCard.frontSide;
        }

        return "";
    }

    getFrontSide(model: CardModel) {
        return model.frontSide
    }

    private getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}