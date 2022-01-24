import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MemoCardSetComponent } from './memo-card-set/memo-card-set.component';
import { CardSetReviewComponent } from './card-set-review/card-set-review.component';
import { AuthGuard } from './services/guard.service';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'memoCard/:id', component: MemoCardSetComponent},
  {path: 'cardSetReview/:id', component: CardSetReviewComponent},
  {path: '**', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
