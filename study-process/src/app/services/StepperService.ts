import { Injectable } from "@angular/core";

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
        this.currentProgressPers = this.currentStepIndex * 100/(this.items.length - 1);
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