import { Component, Injector, OnInit } from '@angular/core';
import { CardModel } from '../models/Card';
import { BaseCardSetComponent } from '../services/BaserCardSetComponent';
import { StepperService, StepperServiceExeA } from '../services/StepperService';

@Component({
  selector: 'app-card-set-exe-a',
  templateUrl: './card-set-exe-a.component.html',
  styleUrls: ['./card-set-exe-a.component.scss']
})
export class CardSetExeAComponent extends BaseCardSetComponent implements OnInit {

  public stepper: StepperServiceExeA | undefined
  radius: number = 15;


  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.onCardSetInitBase().then(() => {
      console.log("resolved")

      this.stepper = new StepperServiceExeA(this.cardSet.items.filter(x => x.inUse))
    }, error => {
      console.log("decline")
    });
  }

}
