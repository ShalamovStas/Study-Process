import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MaterialExampleModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import {AuthGuard} from './services/guard.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AngularFireModule } from '@angular/fire/compat';

import { provideFirebaseApp, initializeApp } 
from '@angular/fire/app';
import { getAuth, provideAuth } 
from '@angular/fire/auth';
import { getFirestore, provideFirestore } 
from '@angular/fire/firestore';
import { getStorage, provideStorage } 
from '@angular/fire/storage';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics';


import { FirebaseDataProviderService } from './services/firebaseDataProvider.service';
import { ImportCardSetService } from './services/importCardSetService';
import { Firestore } from "@angular/fire/firestore";
import { ImportDialogComponent } from './dialogs/import-dialog/import-dialog.component';
import { CreateMemoCardDialogComponent } from './home/dialogs/create-memo-card-dialog/create-memo-card-dialog.component';
import { DeleteMemoCardDialogComponent } from './home/dialogs/delete-memo-card-dialog/delete-memo-card-dialog.component';
import { MemoCardSetComponent } from './memo-card-set/memo-card-set.component';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { CreateWordDialogComponent } from './dialogs/create-word-dialog/create-word-dialog.component';
import { DeleteConfirmationDialogComponent } from './dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CardSetReviewComponent } from './card-set-review/card-set-review.component';

import {Element100vhComponent} from './directives/set-element-100vh.directive'
import {StepperService} from './services/StepperService';
import { CardSetExeAComponent } from './card-set-exe-a/card-set-exe-a.component';
import { BottomMenuSelectModeComponent } from './card-set-exe-a/bottom-sheet/bottom-menu-select-mode/bottom-menu-select-mode.component';
import { FontSizeSetupComponent } from './font-size-setup/font-size-setup.component'


const firebaseConfig = {
  apiKey: "AIzaSyBzi3V5dtuoRXbNrecMt9jdg5n4LxVSj3Y",
  authDomain: "study-process.firebaseapp.com",
  projectId: "study-process",
  storageBucket: "study-process.appspot.com",
  messagingSenderId: "455140505396",
  appId: "1:455140505396:web:e97c906efd1c62b9c45761"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,

    //home
    CreateMemoCardDialogComponent,
    DeleteMemoCardDialogComponent,
    MemoCardSetComponent,
    ToolbarComponent,
    CreateWordDialogComponent,
    DeleteConfirmationDialogComponent,
    CardSetReviewComponent,
    Element100vhComponent,
    CardSetExeAComponent,
    BottomMenuSelectModeComponent,
    FontSizeSetupComponent,
    ImportDialogComponent
  ],
  imports: [
    MaterialExampleModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    HttpClientModule,

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  exports: [
    Element100vhComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthGuard,
    FirebaseDataProviderService,
    ImportCardSetService,
    StepperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

///
// npm install -g firebase-tools
// firebase login
// firebase init

// firebase deploy