import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateMemoCardDialogComponent } from './dialogs/create-memo-card-dialog/create-memo-card-dialog.component';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';
import { DeleteMemoCardDialogComponent } from './dialogs/delete-memo-card-dialog/delete-memo-card-dialog.component';
import { MemoCard, DefaultCategoryService, MemoCardCategory } from '../models/Card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../services/StateService';
import { AppHelper } from '../models/AppHelper';
import { forkJoin } from 'rxjs';
import { FirebaseCollectionKeys } from '../models/AppConstants';
import { Mapper } from '../models/Mapper';
import { CreateMemoCardDialogModel, MemoCardCategoryDialogModel } from '../models/Base';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MemoCardCategoryDialogComponent } from './dialogs/memo-card-category-dialog/memo-card-category-dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  user: any;
  memoCards: Array<MemoCard> = [];

  memoCardsHeap: Array<MemoCard> = [];
  memoCardsEnglish: Array<MemoCard> = [];
  memoCardsProgramming: Array<MemoCard> = [];
  memoCardsOther: Array<MemoCard> = [];

  state: any;

  memoCardCategories: MemoCardCategory[] = [];
  selected: any;

  selectedCards: any[] = [];
  categoryIdFromUrl: string | undefined;
  selectedCategory: MemoCardCategory | undefined;
  defaultCategory: MemoCardCategory | undefined;

  constructor(private router: Router, private db: FirebaseDataProviderService,
    public dialog: MatDialog, private _snackBar: MatSnackBar, private stateService: StateService,
    private activateRoute: ActivatedRoute) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.onBackToCategories();
  }

  ngOnInit(): void {
    let activateRouteSubscription = this.activateRoute.queryParams.subscribe(params => {
      let categoryUrl = params["category"];

      if (categoryUrl !== undefined) {
        this.categoryIdFromUrl = categoryUrl;
      } else {
        this.onBackToCategories();
      }
    });
    activateRouteSubscription?.unsubscribe();

    this.handleCategorySelect();

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

  ngAfterViewInit(): void {
  }

  changeQuery(categoryId: any) {
    this.router.navigate([], { relativeTo: this.activateRoute, queryParams: { category: categoryId } });
  }

  handleCategorySelect() {
    this.state = this.stateService.state$.getValue() || {};

    if (this.state && this.state.currentCategory)
      this.selectedCategory = this.state.currentCategory;
  }

  openDialog(): void {
    const data: CreateMemoCardDialogModel = new CreateMemoCardDialogModel();
    data.dialogTitle = "Create new deck";
    data.saveBtnText = "Create";
    data.categories = this.memoCardCategories;

    const dialogRef = this.dialog.open(CreateMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: data,
      scrollStrategy: new NoopScrollStrategy()
    });

    dialogRef.afterClosed().subscribe(newCardSet => {
      if (newCardSet)
        this.createNewMemoCard(newCardSet);
    });
  }

  openEditDialog(card: any) {
    if (!card)
      return;

    let currentCardModel = JSON.parse(JSON.stringify(card));

    const data: CreateMemoCardDialogModel = new CreateMemoCardDialogModel();
    data.deck = currentCardModel;
    data.dialogTitle = "Edit deck";
    data.saveBtnText = "Save";
    data.categories = this.memoCardCategories;

    const dialogRef = this.dialog.open(CreateMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: data,
      scrollStrategy: new NoopScrollStrategy()
    });

    dialogRef.afterClosed().subscribe(memoCard => {
      if (!memoCard)
        return;

      this.db.updateMemoCard(memoCard).then(() => {
        for (let index = 0; index < this.memoCards.length; index++) {
          if (this.memoCards[index].id == memoCard.id) {
            this.memoCards[index] = memoCard;

            this.onCategorySelect(this.selectedCategory);
            return;
          }
        }
      });
    });
  }

  createNewMemoCard(model: MemoCard) {
    model.userId = this.user.id;

    this.db.createNewMemoCard(model);

    setTimeout(() => {
      this.getData();

      this._snackBar.open(`${model.title} created!`, 'Ok');
      setTimeout(() => {
        this._snackBar.dismiss();
      }, 2000)
    }, 2000)

  }

  getData() {
    const promises = forkJoin(
      [
        this.db.getItemsByUserName(this.user.id, FirebaseCollectionKeys.MemoCardsCategories, Mapper.mapMemoCardCategories),
        this.db.getItemsByUserName(this.user.id, FirebaseCollectionKeys.MemoCards, Mapper.mapMemoCardModel),
      ]
    ).subscribe((resultArray) => {
      console.log(resultArray);
      this.memoCardCategories = resultArray[0] as MemoCardCategory[];

      this.defaultCategory = DefaultCategoryService.getDefaultCategory();

      this.memoCards = resultArray[1] as MemoCard[];

      if (this.categoryIdFromUrl) {
        if (this.categoryIdFromUrl === this.defaultCategory.id) {
          this.onCategorySelect(this.defaultCategory);
        }
        else {
          let categoryByUrl = this.memoCardCategories.find(x => { return x.id === this.categoryIdFromUrl });

          if (categoryByUrl)
            this.onCategorySelect(categoryByUrl);
          else
            this.changeQuery(undefined);
        }
      }

      AppHelper.setCache(this.memoCardCategories, FirebaseCollectionKeys.MemoCardsCategories);
      AppHelper.setCache(this.memoCards, FirebaseCollectionKeys.MemoCards);
    });

    // this.db.getMemoCardsByUserName(this.user.id).then(response => {
    //   this.memoCards = response;

    //   AppHelper.setCacheCardSetList(response);
    // });
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
    });
  }

  openDeck(card: MemoCard) {
    this.state.currentCategory = this.selectedCategory;
    this.stateService.state$.next(this.state);
    this.router.navigate(['/memoCard', card.id]);
  }

  onCategorySelect(category: MemoCardCategory | undefined) {
    if (!category)
      return;

    this.selectedCategory = category;
    this.changeQuery(category.id);

    if (category.id === this.defaultCategory?.id) {
      this.selectedCards = this.memoCards.filter(x => x.categoryId === undefined);

      return;
    }

    this.selectedCards = this.memoCards.filter(x => x.categoryId === category.id);
  }

  onBackToCategories() {
    this.selectedCards = [];
    this.selectedCategory = undefined;
    this.changeQuery(undefined);
  }

  onAddNewCategory() {
    const data: MemoCardCategoryDialogModel = new MemoCardCategoryDialogModel();
    data.dialogTitle = "Create new category";
    data.saveBtnText = "Create";
    data.categories = this.memoCardCategories;

    const dialogRef = this.dialog.open(MemoCardCategoryDialogComponent, {
      maxWidth: '60vw',
      data: data,
      scrollStrategy: new NoopScrollStrategy()
    });

    dialogRef.afterClosed().subscribe(newCategory => {
      if (newCategory) {
        newCategory.userId = this.user.id;

        this._snackBar.open(`Saving ...`);
        this.db.createItem(newCategory, FirebaseCollectionKeys.MemoCardsCategories).then(x => {
          this._snackBar.dismiss();
          this.getData();
        });
      }

    });
  }

  openEditCategory(category: MemoCardCategory | undefined) {
    let currentModel = JSON.parse(JSON.stringify(category));

    const data: MemoCardCategoryDialogModel = new MemoCardCategoryDialogModel();
    data.dialogTitle = "Edit the category";
    data.saveBtnText = "Save";
    data.categories = this.memoCardCategories.filter(x => {return x.id !== category?.id});
    data.category = currentModel;

    const dialogRef = this.dialog.open(MemoCardCategoryDialogComponent, {
      maxWidth: '60vw',
      data: data,
      scrollStrategy: new NoopScrollStrategy()
    });

    dialogRef.afterClosed().subscribe(category => {
      if (category) {
        category.userId = this.user.id;

        this._snackBar.open(`Saving ...`);
        this.db.updateItem(category, FirebaseCollectionKeys.MemoCardsCategories).then(x => {
          this.getData();
          this._snackBar.dismiss();
        });
      }

    });
  }

  openDeleteCategoryDialog(id: string) {
    let memoCards = this.memoCards.filter(x => x.categoryId === id);

    if (memoCards && memoCards.length !== 0) {
      this._snackBar.open(`Can not be deleted`, "Ok");
      return;
    }

    const dialogRef = this.dialog.open(DeleteMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe(model => {
      if (!model || !model.id)
        return;

      this._snackBar.open(`Deleting ...`);
      this.db.deleteItemById(id, FirebaseCollectionKeys.MemoCardsCategories).then(() => {


        this.getData();
        this._snackBar.dismiss();
      });
    });
  }
}
