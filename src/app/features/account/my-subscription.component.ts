import { Component } from '@angular/core';

interface BottleOption {
  count: number;
  price: string;
}

interface UserSubscription {
  planName: string;
  frequency: string;
  status: 'Activa' | 'Pausada' | 'Cancelada';
  bottles: number;
  bottleOptions: BottleOption[];
  shipping: string;
  renewDate: string;
  benefits: string[];
}

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.scss']
})
export class MySubscriptionComponent {
  subscription: UserSubscription = {
    planName: 'Malbec Local',
    frequency: 'mensual',
    status: 'Activa',
    bottles: 3,
    bottleOptions: [
      { count: 3, price: '$32.900' },
      { count: 6, price: '$59.900' }
    ],
    shipping: 'Envío incluido en CABA y GBA',
    renewDate: '15 Feb 2026',
    benefits: [
      'Envío gratis en CABA',
      '10% off en compras adicionales',
      'Newsletter mensual'
    ]
  };

  selectBottleOption(option: BottleOption): void {
    this.subscription = { ...this.subscription, bottles: option.count };
  }

  get displayPrice(): string {
    const match = this.subscription.bottleOptions.find(o => o.count === this.subscription.bottles) || this.subscription.bottleOptions[0];
    return match?.price || '';
  }
}
