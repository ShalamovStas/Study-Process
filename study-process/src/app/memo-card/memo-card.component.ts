import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-memo-card',
  templateUrl: './memo-card.component.html',
  styleUrls: ['./memo-card.component.scss']
})
export class MemoCardComponent implements OnInit {
  subscription: Subscription | undefined;

  constructor(private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.activateRoute.params.subscribe(params => {
      console.log(params['id'])
    });
  }

}
