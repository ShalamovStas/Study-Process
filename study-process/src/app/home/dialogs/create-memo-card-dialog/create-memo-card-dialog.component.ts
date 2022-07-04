import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateMemoCardDialogModel } from 'src/app/models/Base';
import { MemoCard } from 'src/app/models/Card';

@Component({
  selector: 'app-create-memo-card-dialog',
  templateUrl: './create-memo-card-dialog.component.html',
  styleUrls: ['./create-memo-card-dialog.component.scss']
})
export class CreateMemoCardDialogComponent implements OnInit {

  categories = [];

  constructor(
    public dialogRef: MatDialogRef<CreateMemoCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public model: CreateMemoCardDialogModel,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
