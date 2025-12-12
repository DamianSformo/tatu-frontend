import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isSidebarOpen: boolean = false;
  @Output() menuToggled = new EventEmitter<void>();

  promos = [
    { icon: 'local_offer', text: 'Descuento en efectivo' },
    { icon: 'shopping_bag', text: '6x5 en toda la tienda' },
    { icon: 'credit_card', text: '3 cuotas sin interés desde $45.000' }
  ];

  currentPromoIndex = 0;
  intervalId?: any;

  cartCount = 0; // 🔹 contador reactivo del carrito
  isCartOpen = false; // 🔹 state para slide del carrito
  private cartSubscription: any;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.startCarousel();

    // 🔹 Suscribirse a los cambios del carrito
this.cartSubscription = this.cartService.cart$.subscribe(items => {
  // Contamos la cantidad total sumando quantity de cada item
  this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
});
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentPromoIndex = (this.currentPromoIndex + 1) % this.promos.length;
    }, 4000);
  }

  toggleSidebar() {
    this.menuToggled.emit();
  }

  toggleCartSlide() {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCartSlide() {
    this.isCartOpen = false;
  }
}