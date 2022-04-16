import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { AppHelper } from 'src/app/models/AppHelper';
import { Conspect } from 'src/app/models/Conspect';
import { User } from 'src/app/models/User';
import { EmitEvent, EventNames, EventService } from 'src/app/services/event.service';
import { FirebaseDataProviderService } from 'src/app/services/firebaseDataProvider.service';
import { CardSetImportModel, ImportCardSetService } from 'src/app/services/importCardSetService';

enum ToolbarIcon {
  NoBtn = 0,
  Menu,
  BackBtn
}


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {
  routeHome = false;
  routeCardSetHome = false;
  routeCardSetReview = false;

  toolbarIcon: ToolbarIcon = ToolbarIcon.NoBtn;
  toolbarIcons = ToolbarIcon;

  accountBtn: boolean = false;

  user: User | undefined;

  title: string = "My resources";
  @Input() titleAlias: string = "My resources";

  actionBarPath: Array<any> = [];

  toggle: boolean = false;

  constructor(private router: Router, private activateRoute: ActivatedRoute, private importService: ImportCardSetService, public dialog: MatDialog,
    private db: FirebaseDataProviderService, private eventService: EventService) { }

  ngOnInit(): void {
    this.toggle = AppHelper.isDesktop;
    this.user = AppHelper.currentUser;

    if (!this.user) {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
      return;
    }

    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.setFalse();
        if (route.url.match(/home.?/)) {
          this.toolbarIcon = ToolbarIcon.Menu;
          this.routeHome = true;
          return;
        }

        if (route.url.match(/memoCard.?/)) {
          this.toolbarIcon = ToolbarIcon.BackBtn;
          this.routeCardSetHome = true;
          return;
        }

        if (route.url.match(/cardSetReview.?/)
          ||
          route.url.match(/cardSetExeA.?/)) {
          this.toolbarIcon = ToolbarIcon.BackBtn;
          this.routeCardSetReview = true;
          return;
        }

        if (route.url.match(/cardSetExeA.?/)) {
          this.toolbarIcon = ToolbarIcon.BackBtn;
          this.routeCardSetReview = true;
          return;
        }

        if (route.url.match(/login.?/)) {
          this.toolbarIcon = ToolbarIcon.NoBtn;
          this.routeCardSetReview = true;
          return;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const routeAlias = (changes as any).titleAlias;
    if (routeAlias) {
      switch (routeAlias.currentValue) {
        case "":
          this.actionBarPath = [{ title: "MemoCards", link: "/home" }];
          break;
        case "home":
          this.actionBarPath = [{ title: "MemoCards", link: "/home" }];
          break;
        case "memoCard":
          const currentCardName = this.getMemoCardName();
          this.actionBarPath = [{ title: "MemoCards", link: "/home" }, { title: currentCardName, link: "" }];
          break;
        case "conspects-list":
          this.actionBarPath = [{ title: "Conspects", link: "/conspects-list" }];
          break;
        case "conspect":
          const currentName = this.getConspectName();

          this.actionBarPath = [{ title: "Conspects", link: "/conspects-list" }, { title: currentName, link: "" }];
          break;
        default: this.actionBarPath = [];
      }
    }
  }

  getMemoCardName(): string {
    const urlSplitted = this.router.url.split("/");
    const memoCardId = urlSplitted[urlSplitted.length - 1];
    if (!memoCardId)
      return "";

    const memoCard = AppHelper.getCachedCardSetList().find(x => x.id === memoCardId);

    if (!memoCard)
      return "";

    return memoCard.title;
  }

  getConspectName(): string {
    const urlSplitted = this.router.url.split("/");
    const itemId = urlSplitted[urlSplitted.length - 1];
    if (!itemId)
      return "";

    const cachedResult = AppHelper.getCachedConspects();
    
    if (!cachedResult.success)
      return "";

    const item = cachedResult.result.find(x => x.id === itemId);

    if (!item)
      return "";

    return item.title;
  }

  onBackClick() {
    if (this.routeCardSetHome) {
      this.router.navigate(['home']);
      return;
    }

    if (this.routeCardSetReview) {
      history.back();
      return;
    }


  }

  onMenuToggle() {
    this.toggle = !this.toggle;
    this.eventService.emit(new EmitEvent(EventNames.onDrawerOpenIntent, {}));
  }

  setFalse() {
    this.routeHome = false;
    this.routeCardSetHome = false;
    this.routeCardSetReview = false;

  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  openDialogImport() {
    let сardSetImportModel = new CardSetImportModel();

    const dialogRef = this.dialog.open(ImportDialogComponent, {
      minWidth: '70vw',
      data: сardSetImportModel,
    });

    dialogRef.afterClosed().subscribe(result => {
      location.reload();
    });

  }

  syncData() {
    AppHelper.syncData(this.db);
  }

  openConspects() {
    this.router.navigate(['conspects-list']);
  }

}
