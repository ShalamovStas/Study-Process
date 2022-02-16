import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { AppHelper } from 'src/app/models/AppHelper';
import { User } from 'src/app/models/User';
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

  constructor(private router: Router, private activateRoute: ActivatedRoute, private importService: ImportCardSetService, public dialog: MatDialog,
    private db: FirebaseDataProviderService) { }

  ngOnInit(): void {
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
    console.log("opn conspects")
    this.router.navigate(['conspects-list']);
  }
}
