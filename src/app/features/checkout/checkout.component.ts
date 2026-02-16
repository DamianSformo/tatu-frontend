import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { Product } from '../../shared/models/product.model';
import { getMockProducts } from '../../shared/mocks/mock-products';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: { id: number; quantity: number }[] = [];
  cartProducts: Array<{ product: Product; quantity: number }> = [];
  orderPlaced = false;
  step = 1;

  contact = {
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  };

  shippingInfo = {
    address: '',
    street: '',
    streetNumber: '',
    apartment: '',
    neighborhood: '',
    city: '',
    province: '',
    zip: '',
    notes: '',
    method: '',
    pickupOption: '',
    homeOption: '',
    selection: ''
  };

  pickupPoints = [
    'Punto Centro - Av. Siempre Viva 123',
    'Punto Norte - Av. del Libertador 456',
    'Punto Sur - Calle Belgrano 789'
  ];

  zipConfirmed = false;

  billing = {
    document: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    neighborhood: '',
    zip: ''
  };

  billingSameAsRecipient = true;
  showAllShippingOptions = true;
  showOrderDetail = false;

  payment = {
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    installments: 1
  };

  private subscription?: Subscription;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.resolveCartProducts();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private resolveCartProducts() {
    const allProducts = getMockProducts();
    this.cartProducts = this.cartItems
      .map(item => ({
        product: allProducts.find(p => p.id === item.id),
        quantity: item.quantity
      }))
      .filter(cp => cp.product !== undefined) as Array<{ product: Product; quantity: number }>;
  }

  getSubtotal(): number {
    return this.cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getShippingCost(): number {
    if (this.shippingInfo.method === 'pickup') {
      return 0;
    }
    const subtotal = this.getSubtotal();
    return subtotal >= 10000 ? 0 : 500;
  }

  getOptionCost(option: 'pickup-punto' | 'pickup-sucursal' | 'home-estandar' | 'home-express'): number {
    if (option === 'pickup-punto' || option === 'pickup-sucursal') {
      return 0;
    }
    // Por ahora estándar y express usan el mismo costo base.
    return this.getShippingCost();
  }

  getFinalTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  isContactValid(): boolean {
    const emailValid = this.contact.email.includes('@');
    return !!this.contact.email && emailValid;
  }

  isShippingValid(): boolean {
    if (!this.shippingInfo.zip || !this.zipConfirmed) {
      return false;
    }
    if (!this.shippingInfo.selection) {
      return false;
    }

    if (this.shippingInfo.method === 'pickup') {
      // Retiro: no se requieren datos de destinatario, pero sí facturación completa
      return !!this.shippingInfo.pickupOption &&
        !!this.billing.document &&
        !!this.billing.firstName &&
        !!this.billing.lastName &&
        !!this.billing.phone &&
        !!this.billing.address &&
        !!this.shippingInfo.zip;
    }

    // Envío a domicilio: se requieren datos de destinatario y DNI/CUIT
    const recipientOk = !!this.contact.firstName &&
      !!this.contact.lastName &&
      !!this.contact.phone &&
      !!this.shippingInfo.street &&
      !!this.shippingInfo.city;

    if (!recipientOk || !this.billing.document) {
      return false;
    }

    if (this.billingSameAsRecipient) {
      return true;
    }

    // Si no son los mismos, validar datos completos de facturación
    return !!this.billing.firstName &&
      !!this.billing.lastName &&
      !!this.billing.phone &&
      !!this.billing.address &&
      !!this.billing.zip;
  }

  setShippingSelection(option: 'pickup-punto' | 'pickup-sucursal' | 'home-estandar' | 'home-express') {
    this.shippingInfo.selection = option;
    this.showAllShippingOptions = false;
    if (option === 'pickup-punto') {
      this.shippingInfo.method = 'pickup';
      this.shippingInfo.pickupOption = this.pickupPoints[0] || '';
      this.billingSameAsRecipient = false;
    } else if (option === 'pickup-sucursal') {
      this.shippingInfo.method = 'pickup';
      this.shippingInfo.pickupOption = 'sucursal-caseros';
      this.billingSameAsRecipient = false;
    } else if (option === 'home-estandar') {
      this.shippingInfo.method = 'home';
      this.shippingInfo.homeOption = 'correo-estandar';
      this.billingSameAsRecipient = true;
    } else {
      this.shippingInfo.method = 'home';
      this.shippingInfo.homeOption = 'correo-express';
      this.billingSameAsRecipient = true;
    }
  }

  showAllOptions() {
    this.showAllShippingOptions = true;
  }

  confirmZip() {
    this.shippingInfo.zip = (this.shippingInfo.zip || '').trim();
    this.zipConfirmed = !!this.shippingInfo.zip;
  }

  onZipChange(value: string) {
    this.shippingInfo.zip = value;
    this.zipConfirmed = false;
  }

  editZip() {
    this.zipConfirmed = false;
  }

  isPaymentValid(): boolean {
    if (this.payment.method !== 'card') {
      return true;
    }
    return !!this.payment.cardNumber && !!this.payment.cardName && !!this.payment.expiry && !!this.payment.cvv;
  }

  nextStep() {
    if ((this.step === 1 && !this.isContactValid()) || (this.step === 2 && !this.isShippingValid())) {
      return;
    }
    this.step = Math.min(3, this.step + 1);
  }

  prevStep() {
    this.step = Math.max(1, this.step - 1);
  }

  continueShopping() {
    this.router.navigate(['/bebidas/vinos']);
  }

  confirmPurchase() {
    if (!this.cartProducts.length || !this.isPaymentValid()) {
      return;
    }
    this.orderPlaced = true;
    this.cartService.clearCart();
    this.step = 1;
    // TODO: Integrar flujo real de pago/checkout cuando esté disponible.
  }

  onPlaceSelected(place: any) {
    if (!place) {
      return;
    }

    if (place.formatted_address) {
      this.shippingInfo.address = place.formatted_address;
    }

    const comps = place.address_components || [];
    const find = (type: string) => comps.find((c: any) => c.types?.includes(type))?.long_name || '';

    const city = find('locality') || find('administrative_area_level_2');
    const province = find('administrative_area_level_1');
    const zip = find('postal_code');

    if (city) {
      this.shippingInfo.city = city;
    }
    if (province) {
      this.shippingInfo.province = province;
    }
    if (zip) {
      this.shippingInfo.zip = zip;
    }
  }
}
