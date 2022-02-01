import { Injectable } from "@angular/core";
import { runInThisContext } from "vm";
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

export enum MemoCardState {
    Front,
    Back
}

export enum LearnCardMode {
    Normal,
    Reverse
}

export class CardFrontBackStepper {
    private currentCardSide = MemoCardState.Front;
    private _learnMode = LearnCardMode.Normal;

    private currentCard: CardModel = new CardModel();

    get learnMode() {
        return this._learnMode;
    }

    setLearnMode(mode: LearnCardMode) {
        this._learnMode = mode;

        this.initNextCard(this.currentCard);
    }

    public initNextCard(model: CardModel) {
        this.currentCard = model;
        if (this._learnMode === LearnCardMode.Normal) {
            this.currentCardSide = MemoCardState.Front;
        }
        else {
            this.currentCardSide = MemoCardState.Back;
        }
    }

    get currentCardReviewStep() {
        return this.currentCardSide;
    }

    public reviewCardSide() {
        if (this._learnMode === LearnCardMode.Normal) {
            if (this.currentCardSide === MemoCardState.Front)
                this.currentCardSide = MemoCardState.Back;
        }
        else {
            if (this.currentCardSide === MemoCardState.Back)
                this.currentCardSide = MemoCardState.Front;
        }
    }

    public getCardSide(): string {
        switch (this.currentCardSide) {
            case MemoCardState.Front:
                return this.currentCard.frontSide;
            case MemoCardState.Back:
                return this.currentCard.backSide;
        }
    }

    get cardIsReviewed(): boolean {
        if (this._learnMode === LearnCardMode.Normal) {
            return this.currentCardSide === MemoCardState.Back;
        }
        else {
            return this.currentCardSide === MemoCardState.Front;
        }
    }
}

export class StepperServiceExeA {
    private currentCard: CardModel = new CardModel();

    public lastIndex: number = 0;

    private сardFrontBackStepper: CardFrontBackStepper = new CardFrontBackStepper()

    constructor(private items: Array<CardModel>) {
        this.currentCard = items[0];
        this.initCardStepperByCurrentCard();
        this.next;
    }

    setLearnMode(mode : LearnCardMode){
        this.сardFrontBackStepper.setLearnMode(mode);
    }

    get learnMode() {
        return this.сardFrontBackStepper.learnMode;
    }

    get currentText(): string {
        return this.сardFrontBackStepper.getCardSide();
    }

    get currentCardReviewStep(): MemoCardState {
        return this.сardFrontBackStepper.currentCardReviewStep;
    }

    private initCardStepperByCurrentCard() {
        this.сardFrontBackStepper.initNextCard(this.currentCard);
    }


    public next() {
        if (this.сardFrontBackStepper.cardIsReviewed) {

            let index = this.getRandomIntInclusive(0, this.items.length - 1);
            if (index === this.lastIndex)
                index = this.getRandomIntInclusive(0, this.items.length - 1);

            this.lastIndex = index;

            this.currentCard = this.items[index];
            this.initCardStepperByCurrentCard();
        } else {
            this.сardFrontBackStepper.reviewCardSide();
        }
    }

    private getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}