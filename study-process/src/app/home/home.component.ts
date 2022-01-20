import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateMemoCardDialogComponent } from '../create-memo-card-dialog/create-memo-card-dialog.component';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';
import { DeleteMemoCardDialogComponent } from './dialogs/create-memo-card-dialog/delete-memo-card-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any;
  memoCards: Array<any> = [];


  constructor(private router: Router, private db: FirebaseDataProviderService, public dialog: MatDialog) { }

  ngOnInit(): void {
    let stringUser = localStorage.getItem('user');
    if (stringUser)
      this.user = JSON.parse(stringUser);

    if (!this.user || !this.user.id) {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
      return;
    }

    this.db.getMemoCardsByUserName(this.user.id).then(response => {
      console.log(response);
      this.memoCards = response;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: { title: '' },
    });

    dialogRef.afterClosed().subscribe(newDeckTitle => {
      console.log('The dialog was closed');
      console.log(newDeckTitle);
      if (newDeckTitle)
        this.createNewDeck(newDeckTitle);
    });
  }

  createNewDeck(title: string) {
    const deckModel = {
      title: title,
      items: [],
      userId: this.user.id
    }

    this.db.createNewDeck(deckModel);

    this.getData();
    // this.memoCards.push({
    //   title: title + this.memoCards.length
    // });
  }

  getData() {
    this.db.getMemoCardsByUserName(this.user.id).then(response => {
      console.log(response);
      this.memoCards = response;
    })
  }

  onEvent(event: any) {
    event.stopPropagation();
  }


  openDeleteConfirmDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe(model => {
      if (!model || !model.id)
        return;

      this.deleteItem(model.id);
    });
  }

  deleteItem(id: string) {
    if (!id)
      return;
    console.log("Delete")
    console.log(id);

    this.db.deleteMemoCardById(id).then(() => {
      this.getData()
    });
  }

}
