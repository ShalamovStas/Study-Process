import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardSet, Category } from 'src/app/models/Card';

@Component({
  selector: 'app-create-memo-card-dialog',
  templateUrl: './create-memo-card-dialog.component.html',
  styleUrls: ['./create-memo-card-dialog.component.scss']
})
export class CreateMemoCardDialogComponent implements OnInit {

  categories = Category;

  constructor(
    public dialogRef: MatDialogRef<CreateMemoCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public cardModel: CardSet,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
