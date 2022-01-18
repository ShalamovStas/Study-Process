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
import { Firestore } from "@angular/fire/firestore";




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
    HomeComponent
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
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthGuard,
    FirebaseDataProviderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

///
// npm install -g firebase-tools
// firebase login
// firebase init

// firebase deploy