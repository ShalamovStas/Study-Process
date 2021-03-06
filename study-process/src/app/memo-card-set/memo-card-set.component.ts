import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, toHTML, Toolbar, Validators } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { CreateWordDialogComponent } from '../dialogs/create-word-dialog/create-word-dialog.component';
import { DeleteConfirmationDialogComponent } from '../dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AppHelper } from '../models/AppHelper';
import { LearnModel, MemoCard } from '../models/Card';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';

@Component({
  selector: 'app-memo-card-set',
  templateUrl: './memo-card-set.component.html',
  styleUrls: ['./memo-card-set.component.scss']
})
export class MemoCardSetComponent implements OnInit {
  subscription: Subscription | undefined;
  cardSet: MemoCard = new MemoCard();
  breakpoint: number | undefined;

  breakPointWindowWidth = 800;
  toggled = true;

  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private db: FirebaseDataProviderService) {
    this.breakpoint = (window.innerWidth <= this.breakPointWindowWidth) ? 1 : 2;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "+" && this.dialog.openDialogs.length === 0) {
      this.openDialogCreate();
    }
  }

  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe(params => {
      let cardId = params["id"];

      if (!cardId) {
        this.routeToHome();
        return;
      }

      let cachedCardSetList = AppHelper.getCachedCardSetList();
      if (!cachedCardSetList) {
        this.routeToHome();
        return;
      }

      let thisCardSet = cachedCardSetList.find(x => x.id === cardId);

      if (thisCardSet) {
        this.cardSet = thisCardSet
      }
      else
        this.routeToHome();
    });


  }

  ngOnDestroy(): void {
  }

  routeToHome() {
    this.router.navigate(['/home', '']);
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= this.breakPointWindowWidth) ? 1 : 2;
  }

  toggleWord(card: LearnModel) {
    card.inUse = !card.inUse;

    this.db.updateCardItemsById(this.cardSet).then(() => { });
    AppHelper.updateCachedCardSet(this.cardSet);
  }

  openDialogCreate(): void {
    let newCardModel = new LearnModel();
    newCardModel.id = AppHelper.generateGuid();

    const dialogRef = this.dialog.open(CreateWordDialogComponent, {
      minWidth: '70vw',
      data: newCardModel,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;

      this.cardSet.items.push(JSON.parse(JSON.stringify(result)));

      this.db.updateCardItemsById(this.cardSet).then(() => { });
      AppHelper.updateCachedCardSet(this.cardSet);

      this.openDialogCreate();
    });
  }

  openDialogEdit(card: LearnModel) {
    let cardModelToUpdate = (JSON.parse(JSON.stringify(card)) as LearnModel);

    const dialogRef = this.dialog.open(CreateWordDialogComponent, {
      minWidth: '70vw',
      data: cardModelToUpdate,
    });

    dialogRef.afterClosed().subscribe(model => {
      if (!model)
        return;

      for (let index = 0; index < this.cardSet.items.length; index++) {
        if (this.cardSet.items[index].id === model.id) {
          this.cardSet.items[index] = model;
        }
      }
      this.db.updateCardItemsById(this.cardSet).then(() => { });
      AppHelper.updateCachedCardSet(this.cardSet);
    });
  }

  openDialogDelete(model: LearnModel) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      minWidth: '70vw',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;

      this.cardSet.items = this.cardSet.items.filter(x => x.id !== model.id);

      this.db.updateCardItemsById(this.cardSet).then(() => { });
      AppHelper.updateCachedCardSet(this.cardSet);
    });
  }

  onCardSetReviewClick() {
    this.router.navigate(['cardSetReview', this.cardSet.id]);
  }

  onCardExeAClick() {
    this.router.navigate(['cardSetExeA', this.cardSet.id]);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cardSet.items, event.previousIndex, event.currentIndex);

    this.db.updateCardItemsById(this.cardSet).then(() => { });
    AppHelper.updateCachedCardSet(this.cardSet);
  }
}
