import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../shared/models/product.model';
import { getMockProducts } from '../../shared/mocks/mock-products';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  product?: Product;
  quantity = 0;
  private cartSub?: Subscription;

  private resizeListener?: () => void;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private location: Location
  ) {}

  goToBrand(brand: string) {
  this.router.navigate(['/brand', brand]);
}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadMockProductById(id);

    this.cartSub = this.cartService.cart$.subscribe(cart => {
      if (!this.product) return;
      const item = cart.find(i => i.id === this.product!.id);
      this.quantity = item ? item.quantity : 0;
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
    if (this.resizeListener) this.resizeListener();
  }

  ngAfterViewInit(): void {
    // compute and apply right-label width after view is ready
    this.updateRightLabelWidth();

    // update on window resize
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updateRightLabelWidth();
    });
  }

  /**
   * Devuelve una etiqueta legible para el volumen del producto (ej. "750 ml").
   * Busca en `content` + `unit`, luego en `container`, y por último intenta
   * extraer una ocurrencia de volumen desde el `name` (p.ej. "500 ml").
   */
  getVolumeLabel(p: Product): string | null {
    // prefer explicit content/unit
    const anyP = p as any;
    if (anyP.content) {
      if (anyP.unit) return `${anyP.content} ${anyP.unit}`;
      return `${anyP.content}`;
    }
    // fallback to container (used in some beer mocks)
    if (anyP.container) return anyP.container;

    // try to extract volume from name (e.g. "750 ml", "500ml", "1 L")
    if (p.name) {
      const m = p.name.match(/(\d+\s?ml|\d+\s?l|\d+\s?lt)/i);
      if (m) return m[0];
    }

    return null;
  }

  private updateRightLabelWidth() {
    try {
      const host: HTMLElement = this.el.nativeElement as HTMLElement;
      const container = host.querySelector('.wine-profile') as HTMLElement | null;
      if (!container) return;
      const leftLabels = Array.from(container.querySelectorAll<HTMLElement>('.profile-label.left'));
      const rightLabels = Array.from(container.querySelectorAll<HTMLElement>('.profile-label.right'));
      if (!leftLabels.length && !rightLabels.length) return;

      // compute max width for left labels
      let maxLeft = 0;
      leftLabels.forEach(l => {
        const w = Math.ceil(l.getBoundingClientRect().width);
        if (w > maxLeft) maxLeft = w;
      });

      // compute max width for right labels
      let maxRight = 0;
      rightLabels.forEach(l => {
        const w = Math.ceil(l.getBoundingClientRect().width);
        if (w > maxRight) maxRight = w;
      });

      // apply min-width to left labels (so they align to the widest left label)
      if (maxLeft > 0) {
        leftLabels.forEach(l => {
          this.renderer.setStyle(l, 'min-width', `${maxLeft}px`);
          // remove any previously set fixed width/flex to avoid forced truncation
          this.renderer.removeStyle(l, 'width');
          this.renderer.removeStyle(l, 'flex');
        });
      }

      // apply min-width to right labels (so they align to the widest right label)
      if (maxRight > 0) {
        rightLabels.forEach(l => {
          this.renderer.setStyle(l, 'min-width', `${maxRight}px`);
          this.renderer.removeStyle(l, 'width');
          this.renderer.removeStyle(l, 'flex');
        });
      }
    } catch (e) {
      // silent fail
      // console.error('updateRightLabelWidth error', e);
    }
  }

  addToCart() {
    if (this.product) this.cartService.addToCart(this.product.id);
  }

  increase() {
    if (this.product) {
      this.cartService.updateQuantity(this.product.id, this.quantity + 1);
    }
  }

  decrease() {
    if (this.product) {
      this.cartService.updateQuantity(this.product.id, this.quantity - 1);
    }
  }

  goBack() {
    const from = (history && (history as any).state && (history as any).state.from) || null;
    if (from) {
      this.router.navigateByUrl(from);
    } else {
      this.location.back();
    }
  }

  // -----------------------
  // 🔹 MOCK DATA (EXTERNAL)
  // -----------------------
  loadMockProductById(id: number) {
    const mockProducts: Product[] = getMockProducts();
    this.product = mockProducts.find(p => p.id === id);
  }
}
