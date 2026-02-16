import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartCoupon, CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';
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
  showCheckoutPrompt = false;
  appliedCoupon: CartCoupon | null = null;

  constructor(private cartService: CartService, private router: Router, private uiService: UiService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.resolveCartProducts();
    });

    this.cartService.coupon$.subscribe(coupon => {
      this.appliedCoupon = coupon;
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
   * Calcula el descuento aplicado por cupón respetando mínimo de compra y tope de reintegro.
   */
  getDiscount(): number {
    if (!this.appliedCoupon) return 0;

    const subtotal = this.getSubtotal();
    if (subtotal <= 0) return 0;

    const minPurchase = this.appliedCoupon.minPurchaseValue ?? 0;
    if (minPurchase > 0 && subtotal < minPurchase) return 0;

    const percent = this.appliedCoupon.discountPercent ?? 0;
    if (percent <= 0) return 0;

    const raw = subtotal * (percent / 100);
    const cap = this.appliedCoupon.maxRebateValue ?? raw;
    const discount = Math.min(raw, cap);

    return Math.max(0, discount);
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
    const total = this.getSubtotal() - this.getDiscount() + this.getShippingCost();
    return Math.max(0, total);
  }

  removeCoupon() {
    this.cartService.clearCoupon();
  }

  goToCheckout() {
    this.showCheckoutPrompt = true;
  }

  closePrompt() {
    this.showCheckoutPrompt = false;
  }

  proceedAsGuest() {
    this.showCheckoutPrompt = false;
    this.uiService.closeCart();
    this.router.navigate(['/checkout']);
  }

  startLogin() {
    this.showCheckoutPrompt = false;
    this.uiService.closeCart();
    // Navegamos al checkout indicando intención de login; ajusta la ruta si tienes una pantalla de auth dedicada.
    this.router.navigate(['/checkout'], { queryParams: { mode: 'login' } });
  }
}
