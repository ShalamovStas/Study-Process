import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardModel } from 'src/app/models/Card';
import { FirebaseDataProviderService } from 'src/app/services/firebaseDataProvider.service';
import { CardSetImportModel, ImportCardSetService } from 'src/app/services/importCardSetService';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public model: CardSetImportModel,
    private importService: ImportCardSetService,
    private db: FirebaseDataProviderService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    if (!this.model.isValid) {
      return;
    }

    let newCardSet = this.importService.parseCardSet(this.model);
    console.log(newCardSet);

    if (newCardSet) {
      this.db.createNewSet(newCardSet).then(x => {
        this.dialogRef.close(this.model);
      });
    }

  }

}

