import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';
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
    { icon: 'tag', text: 'Descuento en efectivo' },
    { icon: 'shopping-bag', text: '6x5 en toda la tienda' },
    { icon: 'credit-card', text: '3 cuotas sin interés desde $45.000' }
  ];

  currentPromoIndex = 0;
  intervalId?: any;

  cartCount = 0; // 🔹 contador reactivo del carrito
  isCartOpen = false; // 🔹 state para slide del carrito
  private cartSubscription?: Subscription;
  private cartOpenSubscription?: Subscription;

  constructor(private cartService: CartService, private uiService: UiService) {}

  ngOnInit() {
    this.startCarousel();

    // 🔹 Suscribirse a los cambios del carrito
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      // Contamos la cantidad total sumando quantity de cada item
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    // 🔹 Suscribirse a los cambios de visibilidad del carrito
    this.cartOpenSubscription = this.uiService.cartOpen$.subscribe(isOpen => {
      this.isCartOpen = isOpen;
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.cartOpenSubscription) {
      this.cartOpenSubscription.unsubscribe();
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
    this.uiService.toggleCart();
  }

  closeCartSlide() {
    this.uiService.closeCart();
  }
}