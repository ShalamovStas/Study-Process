import { Injector } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppHelper } from "../models/AppHelper";
import { MemoCard } from "../models/Card";

export class BaseCardSetComponent {
  cardSet: MemoCard = new MemoCard();
  activateRoute: ActivatedRoute;
  router: Router;

  constructor(injector: Injector) {
    this.activateRoute = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
  }

  onCardSetInitBase(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.activateRoute.params.subscribe(params => {
        let cardId = params["id"];

        if (!cardId) {
          this.routeToHome();
          return;
        }

        let cachedCardSetList = AppHelper.getCachedCardSetList();
        if (!cachedCardSetList) {
          this.routeToHome();
          return;
        }

        let thisCardSet = cachedCardSetList.find(x => x.id === cardId);

        if (thisCardSet) {
          this.cardSet = thisCardSet
        }
        else
          this.routeToHome();

          resolve(true);

      });
    });

    return promise;
  }

  routeToHome() {
    this.router.navigate(['/home', '']);
  }

}