import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardModel } from 'src/app/models/Card';

@Component({
  selector: 'app-create-word-card-dialog',
  templateUrl: './create-word-dialog.component.html',
  styleUrls: ['./create-word-dialog.component.scss']
})
export class CreateWordDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateWordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public cardModel: CardModel,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    if (!this.cardModel || !this.cardModel.frontSide) {
      return;
    }

    this.dialogRef.close(this.cardModel);
  }

  keyUp(event: any){
    console.log(event)
  }

}

