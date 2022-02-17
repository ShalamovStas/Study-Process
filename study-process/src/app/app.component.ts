import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { EventNames, EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'study-process';

  toggle = false;


  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {

    this.eventService.on(EventNames.onDrawerOpenIntent)
      .subscribe(model => {
        this.toggle = !this.toggle;
      });
  }
}
