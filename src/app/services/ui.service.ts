import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private cartOpenSubject = new BehaviorSubject<boolean>(false);
  cartOpen$ = this.cartOpenSubject.asObservable();

  openCart() {
    this.cartOpenSubject.next(true);
  }

  closeCart() {
    this.cartOpenSubject.next(false);
  }

  toggleCart() {
    this.cartOpenSubject.next(!this.cartOpenSubject.value);
  }
}
