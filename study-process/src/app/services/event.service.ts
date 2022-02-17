import { Observable, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class EventService {

    private subject$ = new Subject<EmitEvent>()

    emit(event: EmitEvent) {
        this.subject$.next(event);
    }

    on(event: string): Observable<any> {
        return this.subject$.pipe(
            filter((e: EmitEvent) => e.name === event),
            map((e: EmitEvent) => e.value));
    }
}

export const EventNames = {
    onDrawerOpenIntent : "onDrawerOpenIntent"
} as const;


export class EmitEvent {
    constructor(public name: string, public value: any) {
    }
}