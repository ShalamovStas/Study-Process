import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  hasAccount: boolean = false;

  constructor(private eventService: EventService, private router: Router, private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    if (!AppHelper.currentUser) {
      this.hasAccount = false;
      return;
    }

    this.hasAccount = true;

    this.eventService.on(EventNames.onDrawerOpenIntent)
      .subscribe(model => {
        this.toggle = !this.toggle;
      });

    if (AppHelper)
      this.handleDrawer(window.innerWidth);
  }

  setHeader() {
    let path = this.router.url.split('/')[1];
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
