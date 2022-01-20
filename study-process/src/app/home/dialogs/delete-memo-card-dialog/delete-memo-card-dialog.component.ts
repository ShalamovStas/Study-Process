import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-memo-card-dialog',
  templateUrl: './delete-memo-card-dialog.component.html',
  styleUrls: ['./delete-memo-card-dialog.component.scss']
})
export class DeleteMemoCardDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteMemoCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

}
