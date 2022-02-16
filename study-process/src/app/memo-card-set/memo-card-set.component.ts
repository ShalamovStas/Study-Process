import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { isArray } from 'util';
import { CreateWordDialogComponent } from '../dialogs/create-word-dialog/create-word-dialog.component';
import { DeleteConfirmationDialogComponent } from '../dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AppHelper } from '../models/AppHelper';
import { CardModel, CardSet } from '../models/Card';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';

import jsonDoc from "./doc";

@Component({
  selector: 'app-memo-card-set',
  templateUrl: './memo-card-set.component.html',
  styleUrls: ['./memo-card-set.component.scss']
})
export class MemoCardSetComponent implements OnInit {
  subscription: Subscription | undefined;
  cardSet: CardSet = new CardSet();
  breakpoint: number | undefined;

  breakPointWindowWidth = 800;
  toggled = true;

  editordoc = jsonDoc;
  html: any;

  form = new FormGroup({
    editorContent: new FormControl(
      { value: jsonDoc, disabled: false },
      Validators.required()
    )
  });

  editor: Editor = new Editor();
  toolbar: Toolbar = [
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"]
  ];


  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private db: FirebaseDataProviderService) {
    this.breakpoint = (window.innerWidth <= this.breakPointWindowWidth) ? 1 : 2;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "+" && this.dialog.openDialogs.length === 0) {
      this.openDialogCreate();
    }
  }

  ngOnInit(): void {
    this.editor = new Editor();

    this.subscription = this.activateRoute.params.subscribe(params => {
      let cardId = params["id"];

      if (!cardId) {
        this.routeToHome();
        return;
      }

      let cachedCardSetList = AppHelper.getLocalStorageCardSetList();
      if (!cachedCardSetList) {
        this.routeToHome();
        return;
      }

      let thisCardSet = cachedCardSetList.find(x => x.id === cardId);

      if (thisCardSet) {
        this.cardSet = thisCardSet
        console.log(thisCardSet);
      }
      else
        this.routeToHome();
    });


  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  getEditorData() {
    let textJSON = this.form.get("editorContent")?.value?.content;

    console.log(textJSON);

    if (!textJSON || !Array.isArray(textJSON))
      return;

    let myDocumentParts = new Array<any>();

    let documentBlock = new Array<any>();

    textJSON.forEach(block => {
      if (block.type === "heading") {
        myDocumentParts.push(documentBlock);
        documentBlock = new Array<any>();
      }
      documentBlock.push(block);
    });

    console.log("myDocumentParts")
    console.log(myDocumentParts);
  }

  routeToHome() {
    this.router.navigate(['/home', '']);
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= this.breakPointWindowWidth) ? 1 : 2;
  }

  toggleWord(card: CardModel) {
    card.inUse = !card.inUse;

    this.db.updateCardItemsById(this.cardSet).then(() => { });
    AppHelper.updateCachedCardSet(this.cardSet);
  }

  openDialogCreate(): void {
    let newCardModel = new CardModel();
    newCardModel.id = AppHelper.generateGuid();

    const dialogRef = this.dialog.open(CreateWordDialogComponent, {
      minWidth: '70vw',
      data: newCardModel,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (!result)
        return;

      this.cardSet.items.push(JSON.parse(JSON.stringify(result)));

      this.db.updateCardItemsById(this.cardSet).then(() => { });
      AppHelper.updateCachedCardSet(this.cardSet);

      this.openDialogCreate();
    });
  }

  openDialogEdit(card: CardModel) {
    let cardModelToUpdate = (JSON.parse(JSON.stringify(card)) as CardModel);

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

  openDialogDelete(model: CardModel) {
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

    console.log("drop")
    this.db.updateCardItemsById(this.cardSet).then(() => { });
    AppHelper.updateCachedCardSet(this.cardSet);
  }
}
