import { Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Conspect } from 'src/app/models/Conspect';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-conspect-dialog',
  templateUrl: './create-conspect-dialog.component.html',
  styleUrls: ['./create-conspect-dialog.component.scss']
})
export class CreateConspectDialogComponent implements OnInit {

  tags: any[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<any[]> | undefined;
  allTags: any[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  constructor(
    public dialogRef: MatDialogRef<CreateConspectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public model: any) {

    this.allTags = model.tags;
    dialogRef.disableClose = true;
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    if (this.tagInput) {
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close(this.model);
  }

}
