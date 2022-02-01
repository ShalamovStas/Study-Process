import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LearnCardMode } from 'src/app/services/StepperService';

@Component({
  selector: 'app-bottom-menu-select-mode',
  templateUrl: './bottom-menu-select-mode.component.html',
  styleUrls: ['./bottom-menu-select-mode.component.scss']
})
export class BottomMenuSelectModeComponent implements OnInit {
  learnCardMode = LearnCardMode;

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomMenuSelectModeComponent>) { }

  ngOnInit(): void {
  }

  setMode(event: MouseEvent, mode: any): void {
    this._bottomSheetRef.dismiss(mode);
    event.preventDefault();
  }

}
