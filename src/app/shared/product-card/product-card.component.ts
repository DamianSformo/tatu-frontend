import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  quantity = 0;

  private cartSub?: Subscription;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    // 🔹 Sincroniza cantidad inicial desde el carrito
    this.quantity = this.cartService.getQuantity(this.product.id);

    // 🔹 Mantiene sincronizado en tiempo real
    this.cartSub = this.cartService.cart$.subscribe(cart => {
      const item = cart.find(i => i.id === this.product.id);
      this.quantity = item ? item.quantity : 0;
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  addToCart() {
    this.cartService.addToCart(this.product.id);
  }

  increase() {
    this.cartService.updateQuantity(this.product.id, this.quantity + 1);
  }

  decrease() {
    this.cartService.updateQuantity(this.product.id, this.quantity - 1);
  }

  openDetail() {
    // navigate to product detail and include current url in state so detail can go back
    this.router.navigate(['/product', this.product.id], { state: { from: this.router.url } });
  }
}
