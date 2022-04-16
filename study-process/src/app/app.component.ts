import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppHelper } from './models/AppHelper';
import { EventNames, EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  titleAlias = 'study-process';
  toggle = false;

  drawerStates: "side" | "over" = "over";
  hasBackground: boolean = true;

  constructor(private eventService: EventService, private route: Router) {
  }

  ngOnInit(): void {

    this.eventService.on(EventNames.onDrawerOpenIntent)
      .subscribe(model => {
        this.toggle = !this.toggle;
      });

    this.handleDrawer(window.innerWidth);
  }

  setHeader() {
    let path = this.route.url.split('/')[1];
    this.titleAlias = decodeURIComponent(path);
  }

  handleDrawer(innerWidth: number) {
    if (!innerWidth)
      return;

    if (AppHelper.isDesktop) {
      this.drawerStates = 'side';
      this.hasBackground = false;
      this.toggle = true;
    } else {
      this.drawerStates = 'over';
      this.hasBackground = true;
      this.toggle = false;

    }
  }

  onDrawerItemClick() {
    if (AppHelper.isDesktop)
      return;

    this.toggle = !this.toggle;
    AppHelper
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.handleDrawer(event.target.innerWidth);
  }
}
