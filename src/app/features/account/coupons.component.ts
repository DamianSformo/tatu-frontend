import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/ui.service';

interface Coupon {
  code: string;
  title: string;
  detail: string;
  status: 'activo' | 'redimido';
  expires: string;
  minPurchase: string;
  maxRebate: string;
  discountPercent: number;
  maxRebateValue: number;
  minPurchaseValue: number;
}

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent {
  constructor(private cartService: CartService, private uiService: UiService) {}

  coupons: Coupon[] = [
    {
      code: 'CATA-GRATIS',
      title: '20% de descuento en toda la compra',
      detail: '1 cupo para próxima cata presencial',
      status: 'activo',
      expires: '31 de marzo',
      minPurchase: '$15.000',
      maxRebate: '$10.000',
      discountPercent: 20,
      maxRebateValue: 10000,
      minPurchaseValue: 15000
    },
    {
      code: 'ENVIO-15K',
      title: 'Envío bonificado',
      detail: 'Aplica en pedidos mayores a $15.000',
      status: 'redimido',
      expires: '15 de diciembre',
      minPurchase: '$15.000',
      maxRebate: '$5.000',
      discountPercent: 0,
      maxRebateValue: 5000,
      minPurchaseValue: 15000
    }
  ];

  applyCoupon(coupon: Coupon): void {
    this.cartService.applyCoupon({
      code: coupon.code,
      title: coupon.title,
      detail: coupon.detail,
      expires: coupon.expires,
      minPurchase: coupon.minPurchase,
      maxRebate: coupon.maxRebate,
      discountPercent: coupon.discountPercent,
      maxRebateValue: coupon.maxRebateValue,
      minPurchaseValue: coupon.minPurchaseValue
    });

    // Abre el carrito para que el usuario vea el cupón aplicado
    this.uiService.openCart();
  }
}
