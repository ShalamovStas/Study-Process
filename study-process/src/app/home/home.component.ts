import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateMemoCardDialogComponent } from './dialogs/create-memo-card-dialog/create-memo-card-dialog.component';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';
import { DeleteMemoCardDialogComponent } from './dialogs/delete-memo-card-dialog/delete-memo-card-dialog.component';
import { CardSet, Category } from '../models/Card';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any;
  memoCards: Array<CardSet> = [];

  memoCardsHeap: Array<CardSet> = [];
  memoCardsEnglish: Array<CardSet> = [];
  memoCardsProgramming: Array<CardSet> = [];
  memoCardsOther: Array<CardSet> = [];

  constructor(private router: Router, private db: FirebaseDataProviderService,
    public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let stringUser = localStorage.getItem('user');
    if (stringUser)
      this.user = JSON.parse(stringUser);

    if (!this.user || !this.user.id) {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
      return;
    }

    this.getData();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: new CardSet(),
    });

    dialogRef.afterClosed().subscribe(newCardSet => {
      console.log('The dialog was closed');
      console.log(newCardSet);

      if (newCardSet)
        this.createNewSet(newCardSet);
    });
  }

  openEditDialog(card: any) {
    if (!card)
      return;

    let currentCardModel = JSON.parse(JSON.stringify(card));
    console.log(currentCardModel)

    const dialogRef = this.dialog.open(CreateMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: currentCardModel,
    });

    dialogRef.afterClosed().subscribe(newCard => {
      if (!newCard)
        return;

      this.db.updateCardSet(newCard).then(() => {
        for (let index = 0; index < this.memoCards.length; index++) {
          if (this.memoCards[index].id == newCard.id) {
            this.memoCards[index] = newCard;
            this.filterSetsByCategories();
            return;
          }
        }
      });
    });
  }

  createNewSet(model: CardSet) {
    model.userId = this.user.id;

    this.db.createNewSet(model);

    setTimeout(() => {
      this.getData();

      this._snackBar.open(`${model.title} created!`, 'Ok');
      setTimeout(() => {
        this._snackBar.dismiss();
      }, 2000)
    }, 2000)

  }

  getData() {
    this.db.getMemoCardsByUserName(this.user.id).then(response => {
      console.log(response);
      this.memoCards = response;
      localStorage.setItem("memoCardSets", JSON.stringify(response));

      this.filterSetsByCategories();
    });
  }

  filterSetsByCategories() {
    this.memoCardsHeap = this.memoCards.filter(x => x.category === Category.Heap || !x.category);
    this.memoCardsEnglish = this.memoCards.filter(x => x.category === Category.English);
    this.memoCardsProgramming = this.memoCards.filter(x => x.category === Category.Programming);
    this.memoCardsOther = this.memoCards.filter(x => x.category === Category.Other);
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
      this.getData();
      this._snackBar.open(`Deleted`, 'Ok');
    });
  }

  openDeck(card: CardSet) {
    console.log("open deck");
    this.router.navigate(['/memoCard', card.id]);
  }

}
