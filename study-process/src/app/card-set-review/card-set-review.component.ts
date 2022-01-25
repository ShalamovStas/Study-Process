import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Component, Injector, OnInit } from '@angular/core';
import { CardModel, CardSet } from '../models/Card';
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

  constructor(injector: Injector, public stepperService: StepperService<CardModel>) {
    super(injector);
  }

  ngOnInit(): void {
    this.onCardSetInitBase().then(() => {
      console.log("resolved")

      this.stepperService.init(this.cardSet.items.filter(x => x.inUse));
    }, error => {
      console.log("decline")
    });
  }

}
