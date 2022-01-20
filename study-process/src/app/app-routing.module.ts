import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MemoCardComponent } from './memo-card/memo-card.component';
import { AuthGuard } from './services/guard.service';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'memoCard/:id', component: MemoCardComponent},
  {path: '**', component: HomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
