import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-memo-card-dialog',
  templateUrl: './create-memo-card-dialog.component.html',
  styleUrls: ['./create-memo-card-dialog.component.scss']
})
export class CreateMemoCardDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateMemoCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public cardModel: any,
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
