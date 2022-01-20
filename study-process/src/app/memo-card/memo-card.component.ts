import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Card } from '../models/Card';

@Component({
  selector: 'app-memo-card',
  templateUrl: './memo-card.component.html',
  styleUrls: ['./memo-card.component.scss']
})
export class MemoCardComponent implements OnInit {
  subscription: Subscription | undefined;
  card: Card | undefined;

  constructor(private activateRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe(params => {
      let cardId = params["id"];
      
      if (!cardId) {
        this.routeToHome();
        return;
      }

      let cards;
      let cachedCards = localStorage.getItem("memoCards");;

      if (!cachedCards) {
        this.routeToHome();
        return;
      }

      if (cachedCards)
        cards = JSON.parse(cachedCards);

      this.card = (cards as Array<Card>).find(x => x.id === cardId);

      if (!this.card)
        this.routeToHome();
    });
  }

  routeToHome() {
    this.router.navigate(['/home', '']);
  }

}
