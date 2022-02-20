import { Component, OnInit } from '@angular/core';
import { Console } from 'console';
import { Tag } from '../models/Conspect';
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

  filterTagSelected : boolean = false;

  constructor(private db: FirebaseDataProviderService) { }

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

  onTagDrop(){
    this.filteredConspects = this.conspects;
    this.filterTagSelected = false;

  }

  openEditDialog(item: any) {

  }

  openDeleteConfirmDialog(item: any) {

  }

  openItem(item: any) {

  }

  onEvent(event: any) {
    event.stopPropagation();
  }
}
