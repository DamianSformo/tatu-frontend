import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Datos básicos del cupón guardado en el carrito
export interface CartCoupon {
  code: string;
  title: string;
  detail?: string;
  expires?: string;
  minPurchase?: string;
  maxRebate?: string;
  discountPercent?: number;
  maxRebateValue?: number;
  minPurchaseValue?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartIds: { id: number; quantity: number }[] = [];
  private cartSubject = new BehaviorSubject<{ id: number; quantity: number }[]>([]);
  cart$ = this.cartSubject.asObservable();

  private couponSubject = new BehaviorSubject<CartCoupon | null>(null);
  coupon$ = this.couponSubject.asObservable();

  addToCart(id: number) {
    const item = this.cartIds.find(i => i.id === id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cartIds.push({ id, quantity: 1 });
    }
    this.cartSubject.next([...this.cartIds]);
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.cartIds.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(id);
        return;
      }
      this.cartSubject.next([...this.cartIds]);
    }
  }

  removeFromCart(id: number) {
    this.cartIds = this.cartIds.filter(item => item.id !== id);
    this.cartSubject.next([...this.cartIds]);
  }

  clearCart() {
    this.cartIds = [];
    this.cartSubject.next([]);
    this.clearCoupon();
  }

  applyCoupon(coupon: CartCoupon) {
    this.couponSubject.next({ ...coupon });
  }

  clearCoupon() {
    this.couponSubject.next(null);
  }

  getAppliedCoupon(): CartCoupon | null {
    return this.couponSubject.value;
  }

  // 🔹 Agregado: obtener cantidad actual de un producto
  getQuantity(id: number): number {
    return this.cartIds.find(item => item.id === id)?.quantity || 0;
  }

  // 🔹 (Opcional) obtener todo el carrito
  getItems(): { id: number; quantity: number }[] {
    return [...this.cartIds];
  }
}
