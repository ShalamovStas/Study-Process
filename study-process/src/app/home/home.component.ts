import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateMemoCardDialogComponent } from './dialogs/create-memo-card-dialog/create-memo-card-dialog.component';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';
import { DeleteMemoCardDialogComponent } from './dialogs/delete-memo-card-dialog/delete-memo-card-dialog.component';
import { CardSet, Category } from '../models/Card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../services/StateService';
import { AppHelper } from '../models/AppHelper';

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

  currentTab: number = 0;
  state: any;

  constructor(private router: Router, private db: FirebaseDataProviderService,
    public dialog: MatDialog, private _snackBar: MatSnackBar, private stateService: StateService,
    private activateRoute: ActivatedRoute) { }


  changeQuery(tag: any) {
    this.router.navigate([], { relativeTo: this.activateRoute, queryParams: { tag: tag } });
  }

  ngOnInit(): void {
    let activateRouteSubscription = this.activateRoute.queryParams.subscribe(params => {
      let tag = params["tag"];
      if (tag) {
        this.currentTab = tag;
      }
    });
    activateRouteSubscription?.unsubscribe();

    this.handleTabState();

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

  handleTabState() {
    this.state = this.stateService.state$.getValue() || {};

    if (this.state && this.state.currentTab)
      this.currentTab = this.state.currentTab;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: new CardSet(),
    });

    dialogRef.afterClosed().subscribe(newCardSet => {
      if (newCardSet)
        this.createNewSet(newCardSet);
    });
  }

  openEditDialog(card: any) {
    if (!card)
      return;

    let currentCardModel = JSON.parse(JSON.stringify(card));

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
      this.memoCards = response;
      this.filterSetsByCategories();

      AppHelper.setCacheCardSetList(response);
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

    this.db.deleteMemoCardById(id).then(() => {
      this.getData();
      AppHelper.syncData(this.db);
    });
  }

  openDeck(card: CardSet) {
    this.state.currentTab = this.currentTab;
    this.stateService.state$.next(this.state);
    this.router.navigate(['/memoCard', card.id]);
  }

  onTabChange(event: any) {
    this.currentTab = event.index
    this.changeQuery(this.currentTab);
  }

}
