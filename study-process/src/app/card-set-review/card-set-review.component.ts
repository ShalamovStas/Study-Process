import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { LearnModel, MemoCard } from '../models/Card';
import { BaseCardSetComponent } from '../services/BaserCardSetComponent';
import { StepperService } from '../services/StepperService';


export const fadeInOut = (name = 'fadeInOut', duration = 0.1) =>
  trigger(name, [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`${duration}s ease-in-out`)
    ]),
    transition(':leave', [animate(`${duration}s ease-in-out`, style({ opacity: 0 }))])
  ])

@Component({
  selector: 'app-card-set-review',
  templateUrl: './card-set-review.component.html',
  styleUrls: ['./card-set-review.component.scss'],
  animations: [
    fadeInOut('fadeInOut-1', 0.3),
    fadeInOut('fadeInOut-2', 0.7),
    fadeInOut('fadeInOut-3', 1)
  ]
})
export class CardSetReviewComponent extends BaseCardSetComponent implements OnInit {

  radius: number = 15;
  constructor(injector: Injector, public stepperService: StepperService<LearnModel>) {
    super(injector);
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      this.stepperService.getNextStep();
    } else if(event.key === "ArrowLeft"){
      this.stepperService.getPreviousStep();
    }
  }

  ngOnInit(): void {
    this.onCardSetInitBase().then(() => {
      this.stepperService.init(this.cardSet.items.filter(x => x.inUse));
    }, error => {
    });
  }

}
