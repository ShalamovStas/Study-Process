import { Component, Injector, OnInit } from '@angular/core';
import { CardModel, CardSet } from '../models/Card';
import { BaseCardSetComponent } from '../services/BaserCardSetComponent';
import { StepperService } from '../services/StepperService';

@Component({
  selector: 'app-card-set-review',
  templateUrl: './card-set-review.component.html',
  styleUrls: ['./card-set-review.component.scss']
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
