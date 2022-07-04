import { Component, Injector, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LearnModel } from '../models/Card';
import { BaseCardSetComponent } from '../services/BaserCardSetComponent';
import { LearnCardMode, MemoCardState, StepperService, StepperServiceExeA } from '../services/StepperService';
import { BottomMenuSelectModeComponent } from './bottom-sheet/bottom-menu-select-mode/bottom-menu-select-mode.component';

@Component({
  selector: 'app-card-set-exe-a',
  templateUrl: './card-set-exe-a.component.html',
  styleUrls: ['./card-set-exe-a.component.scss']
})
export class CardSetExeAComponent extends BaseCardSetComponent implements OnInit {

  public stepper: StepperServiceExeA | undefined
  radius: number = 15;

  cardSide = MemoCardState;
  learnMode = LearnCardMode;

  constructor(injector: Injector, private _bottomSheet: MatBottomSheet) {
    super(injector);
  }

  ngOnInit(): void {
    this.onCardSetInitBase().then(() => {
      this.stepper = new StepperServiceExeA(this.cardSet.items.filter(x => x.inUse))
    }, error => {
    });
  }

  openBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(BottomMenuSelectModeComponent);
    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result === undefined)
        result = this.stepper?.learnMode;

      this.stepper?.setLearnMode(result);
    });
  }


}

