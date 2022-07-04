import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemoCardCategoryDialogModel } from 'src/app/models/Base';

@Component({
  selector: 'app-memo-card-category-dialog',
  templateUrl: './template.component.html',
  styleUrls: ['./styles.component.scss']
})
export class MemoCardCategoryDialogComponent implements OnInit {

  get isUnique(): boolean {
    return this.model.categories.find(x => {
      return x.name.replace(/\s/g, "").toLocaleUpperCase() === this.model.category.name.replace(/\s/g, "").toLocaleUpperCase()
    }) === undefined;
  }

  constructor(
    public dialogRef: MatDialogRef<MemoCardCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public model: MemoCardCategoryDialogModel,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
