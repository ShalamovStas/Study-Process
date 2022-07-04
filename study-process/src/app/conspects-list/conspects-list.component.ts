import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { Console } from 'console';
import { idToken } from 'rxfire/auth';
import { CreateConspectDialogComponent } from '../dialogs/create-conspect-dialog/create-conspect-dialog.component';
import { DeleteMemoCardDialogComponent } from '../home/dialogs/delete-memo-card-dialog/delete-memo-card-dialog.component';
import { AppHelper } from '../models/AppHelper';
import { MemoCard } from '../models/Card';
import { Conspect, Tag } from '../models/Conspect';
import { FirebaseDataProviderService } from '../services/firebaseDataProvider.service';

@Component({
  selector: 'app-conspects-list',
  templateUrl: './conspects-list.component.html',
  styleUrls: ['./conspects-list.component.scss']
})
export class ConspectsListComponent implements OnInit {

  tags: Array<any> = new Array<any>();
  conspects: Array<any> = new Array<any>();

  filterTagSelected: boolean = false;

  constructor(private db: FirebaseDataProviderService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getConspects();
  }

  getConspects() {
    this.db.getConspects(AppHelper.currentUser?.id).then(x => {
      this.mapTags(x.map(x => x.tag));

      this.conspects = x;
      //AppHelper.setCachedConspects(this.conspects);
    });
  }

  mapTags(tags: string[]) {
    tags.forEach(tag => {
      let tagModel = new Tag();
      tagModel.selected = false;
      tagModel.title = tag;

      this.tags.push(tagModel);
    });

  }

  onTagSelected(tag: any) {
    this.filterTagSelected = true;
  }

  onTagDrop() {
    this.filterTagSelected = false;
  }

  openEditDialog(item: any) {
    let objectToEdit = JSON.parse(JSON.stringify(item));

    const dialogRef = this.dialog.open(CreateConspectDialogComponent, {
      panelClass: "dialog-responsive",
      data: objectToEdit,
    });

    dialogRef.afterClosed().subscribe(model => {
      if (!model)
        return;

      for (let index = 0; index < this.conspects.length; index++) {
        const element = this.conspects[index];
        if (element.id === item.id) {
          this.conspects[index] = model;
          break;
        }
      }

      this.db.updateConspect(model);
      AppHelper.setCachedConspects(this.conspects);
    });
  }

  openDeleteConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(DeleteMemoCardDialogComponent, {
      maxWidth: '60vw',
      data: id,
    });

    dialogRef.afterClosed().subscribe(id => {
      if (!id)
        return;
      this.deleteItem(id);
    });
  }

  deleteItem(id: any) {
    this.conspects = this.conspects.filter(x => x.id !== id);
    AppHelper.setCachedConspects(this.conspects);
    this.db.deleteConspectId(id);
  }

  openItem(item: any) {
    this.router.navigate(['conspect', item.id]);
  }

  onEvent(event: any) {
    event.stopPropagation();
  }

  openDialog() {
    let newConspect = new Conspect();
    newConspect.id = AppHelper.generateGuid();

    const dialogRef = this.dialog.open(CreateConspectDialogComponent, {
      panelClass: "dialog-responsive",
      data: newConspect,
    });

    dialogRef.afterClosed().subscribe(model => {

      if (!model)
        return;

      this.db.createConspect(model);
      this.conspects.push(model);
      AppHelper.setCachedConspects(this.conspects);
    });
  }

}
