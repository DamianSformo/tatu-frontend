import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product, WineProduct, BeerProduct } from '../models/product.model';

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
    const allProducts = [...this.getMockProducts()];
    
    this.cartProducts = this.cartItems
      .map(item => ({
        product: allProducts.find(p => p.id === item.id),
        quantity: item.quantity
      }))
      .filter(cp => cp.product !== undefined) as Array<{ product: Product; quantity: number }>;
  }

  /**
   * Obtiene todos los productos mock (vinos + cervezas).
   */
  private getMockProducts(): Product[] {
    return [...this.getWines(), ...this.getBeers()];
  }

  getWines(): WineProduct[] {
    return [
      {
        id: 1,
        content: 750,
        unit: 'ml',
        productType: 'wine',
        imageUrl: 'assets/image 12.png',
        isNew: true,
        brand: 'CAFAYATE',
        name: 'Vino Blanco Cafayate 750 ml',
        price: 5030,
        discount: 15,
        installment: '6 cuotas sin interés de $1780,00',
        rating: 4.8,
        reviewsCount: 5,
        pricePerLiter: '$9.010,50',
        year: 2023,
        origin: 'Argentina',
        type: 'Blanco',
        body: 100,
        acidity: 50,
        tannins: 80,
        sweetness: 10,
        wineryDescription: 'Testeo de la descripción',
        maridajes: ['Carnes Rojas', 'Quesos Curados', 'Pastas con Salsa Roja']
      },
      {
        id: 2,
        content: 750,
        unit: 'ml',
        productType: "wine",
        imageUrl: 'assets/image 12.png',
        brand: 'CAFAYATE',
        name: 'Vino Tinto Malbec Cafayate 750 ml',
        oldPrice: 7529,
        price: 5029,
        discount: 15,
        installment: '6 cuotas sin interés de $1780,00',
        rating: 4.8,
        reviewsCount: 5,
        pricePerLiter: '$9.010,50',
        variety: 'Malbec',
        year: 2023,
        region: 'Salta',
        alcohol: 13.5,
        type: 'Tinto',
        origin: 'Argentina',
        bodega_id: 1,
        body: 100,
        acidity: 50,
        tannins: 80,
        sweetness: 10,
        maridajes: ['Asado', 'Comida Criolla', 'Guisos']
      }
    ];
  }

  getBeers(): BeerProduct[] {
    return [
      {
        id: 3,
        content: 500,
        unit: 'ml',
        productType: 'beer',
        imageUrl: 'assets/beer1.png',
        isNew: true,
        brand: 'Patagonia',
        name: 'Cerveza IPA 500 ml',
        price: 1800,
        discount: 10,
        rating: 4.7,
        reviewsCount: 32,
        pricePerLiter: '$3.600,00',
        origin: 'Argentina',
        type: 'IPA',
        ibu: 45,
        container: 'Botella'
      }
    ];
  }

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
