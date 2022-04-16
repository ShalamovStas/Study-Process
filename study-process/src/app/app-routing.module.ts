import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MemoCardSetComponent } from './memo-card-set/memo-card-set.component';
import { CardSetReviewComponent } from './card-set-review/card-set-review.component';
import { AuthGuard } from './services/guard.service';
import { CardSetExeAComponent } from './card-set-exe-a/card-set-exe-a.component';
import { ConspectsListComponent } from './conspects-list/conspects-list.component';
import { ConspectComponent } from './conspect/conspect.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'memoCard/:id', component: MemoCardSetComponent, canActivate: [AuthGuard]},
  {path: 'cardSetReview/:id', component: CardSetReviewComponent, canActivate: [AuthGuard]},
  {path: 'cardSetExeA/:id', component: CardSetExeAComponent, canActivate: [AuthGuard]},
  {path: 'conspects-list', component: ConspectsListComponent, canActivate: [AuthGuard]},
  {path: 'conspect/:id', component: ConspectComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
