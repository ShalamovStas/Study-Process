import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Console } from 'console';
import { CreateConspectDialogComponent } from '../dialogs/create-conspect-dialog/create-conspect-dialog.component';
import { CreateMemoCardDialogComponent } from '../home/dialogs/create-memo-card-dialog/create-memo-card-dialog.component';
import { CardSet } from '../models/Card';
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
  filteredConspects: Array<any> = new Array<any>();

  filterTagSelected: boolean = false;

  constructor(private db: FirebaseDataProviderService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.db.getConspects("").then(x => {
      console.log(x);
      this.mapTags(x.map(x => x.tag))

      this.conspects = x;
      this.filteredConspects = this.conspects;
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
    console.log(tag);
    this.filteredConspects = this.conspects.filter(x => x.tag === tag.title);
  }

  onTagDrop() {
    this.filteredConspects = this.conspects;
    this.filterTagSelected = false;

  }

  openEditDialog(item: any) {
    const dialogRef = this.dialog.open(CreateConspectDialogComponent, {
      panelClass: "dialog-responsive",
      data: item,
    });

    dialogRef.afterClosed().subscribe(newCardSet => {
      console.log('The dialog was closed');
      console.log(newCardSet);

      if (!newCardSet)
        return;

      for (let index = 0; index < this.conspects.length; index++) {
        const element = this.conspects[index];
        if (element.id === item.id) {
          this.conspects[index] = newCardSet;
          return;
        }
      }
    });
  }

  openDeleteConfirmDialog(item: any) {

  }

  openItem(item: any) {

  }

  onEvent(event: any) {
    event.stopPropagation();
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateConspectDialogComponent, {
      panelClass: "dialog-responsive",
      data: new Conspect(),
    });

    dialogRef.afterClosed().subscribe(newCardSet => {
      console.log('The dialog was closed');
      console.log(newCardSet);

      if (!newCardSet)
        return;

      this.conspects.push(newCardSet);
    });
  }

}
