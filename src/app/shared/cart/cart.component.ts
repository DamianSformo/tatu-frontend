import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product, WineProduct, BeerProduct } from '../models/product.model';
import { getMockProducts } from '../mocks/mock-products';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: { id: number; quantity: number }[] = [];
  cartProducts: Array<{ product: Product; quantity: number }> = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.resolveCartProducts();
    });
  }

  /**
   * Resuelve los productos completos basándose en los IDs en el carrito.
   */
  private resolveCartProducts() {
    const allProducts = getMockProducts();
    this.cartProducts = this.cartItems
      .map(item => ({
        product: allProducts.find(p => p.id === item.id),
        quantity: item.quantity
      }))
      .filter(cp => cp.product !== undefined) as Array<{ product: Product; quantity: number }>;
  }

  // Los métodos getMockProducts, getWines y getBeers han sido reemplazados por el uso de getMockProducts() externo.

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  increase(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      this.cartService.updateQuantity(id, item.quantity + 1);
    }
  }

  decrease(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(id, item.quantity - 1);
    } else {
      this.removeItem(id);
    }
  }

  /**
   * Calcula el total del carrito.
   */
  getTotal(): number {
    return this.cartProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  /**
   * Calcula el subtotal (suma de precios sin envío).
   */
  getSubtotal(): number {
    return this.getTotal();
  }

  /**
   * Calcula el costo de envío (fijo: $500, o gratis si subtotal >= $10000).
   */
  getShippingCost(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= 10000 ? 0 : 500;
  }

  /**
   * Calcula el total final (subtotal + envío).
   */
  getFinalTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }
}
