import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface Benefit {
  title: string;
  detail: string;
}

interface RewardHistory {
  title: string;
  ml: number;
  date: string;
  badge?: string;
}

interface Challenge {
  title: string;
  detail: string;
  progressCurrent: number;
  progressTotal: number;
  reward: string;
  purchased: string[];
  remaining: string[];
  couponCode?: string;
}

interface Coupon {
  code: string;
  title: string;
  detail: string;
  status: 'activo' | 'redimido';
  expires: string;
}

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class RewardsComponent {
  selectedChallenge: Challenge | null = null;
  selectedBenefitsTab: 'current' | 'next' = 'current';
  showExpiredHistory: boolean = false;

  summary = {
    ml: 3450,
    tier: 'Reserva',
    nextTier: 'Ícono',
    remainingToNext: 1250
  };

  currentBenefits: Benefit[] = [
    { title: '15% de descuento en vinos.', detail: '' },
    { title: 'Envío gratis a todo el país', detail: '' },
    { title: '3x2 en degustaciones', detail: '' }
  ];

  nextBenefits: Benefit[] = [
    { title: '20% de descuento en vinos.', detail: '' },
    { title: 'Envío express gratis', detail: '' },
    { title: '4x3 en degustaciones', detail: '' },
    { title: 'Acceso a eventos exclusivos', detail: '' }
  ];

  challenges: Challenge[] = [
    {
      title: 'Explorá uvas',
      detail: 'Compra 5 uvas distintas',
      progressCurrent: 3,
      progressTotal: 5,
      reward: '+150 ml',
      purchased: ['Malbec', 'Cabernet Sauvignon', 'Pinot Noir'],
      remaining: ['Merlot', 'Syrah']
    },
    {
      title: 'Fan del Malbec',
      detail: 'Comprá 6 vinos Malbec',
      progressCurrent: 2,
      progressTotal: 6,
      reward: '+200 ml',
      purchased: ['Malbec Reserva 2019', 'Malbec Joven 2021'],
      remaining: ['Malbec Gran Reserva', 'Malbec Single Vineyard', 'Malbec Blend', 'Malbec Rosé']
    },
    {
      title: 'Mix de bebidas',
      detail: 'Comprá 6 bebidas distintas',
      progressCurrent: 4,
      progressTotal: 6,
      reward: '+180 ml',
      purchased: ['Gin Patagonia', 'Vermut Rojo', 'Aperitivo Citrus', 'Whisky Blend'],
      remaining: ['Vodka Premium', 'Ron Añejo']
    },
    {
      title: 'Catas en vivo',
      detail: 'Participá en 5 catas',
      progressCurrent: 5,
      progressTotal: 5,
      reward: '+220 ml + cupón',
      purchased: [],
      remaining: [],
      couponCode: 'CATA-GRATIS'
    }
  ];

  coupons: Coupon[] = [
    {
      code: 'CATA-GRATIS',
      title: 'Cata sin cargo',
      detail: '1 cupo para próxima cata presencial',
      status: 'activo',
      expires: '31/03/2026'
    },
    {
      code: 'ENVIO-15K',
      title: 'Envío bonificado',
      detail: 'Aplica en pedidos mayores a $15.000',
      status: 'redimido',
      expires: '15/01/2026'
    }
  ];

  // TrackBy functions para optimizar *ngFor
  trackByTitle(index: number, item: Benefit): string {
    return item.title;
  }

  trackByChallengeTitle(index: number, item: Challenge): string {
    return item.title;
  }

  trackByHistoryTitle(index: number, item: RewardHistory): string {
    return item.title + item.date;
  }

  trackByItem(index: number, item: string): string {
    return item;
  }

  openChallenge(challenge: Challenge): void {
    this.selectedChallenge = challenge;
  }

  closeChallenge(): void {
    this.selectedChallenge = null;
  }

  isChallengeComplete(challenge: Challenge): boolean {
    return challenge.progressCurrent >= challenge.progressTotal;
  }

  redeemChallenge(event: Event, challenge: Challenge): void {
    event.stopPropagation();
    if (this.isChallengeComplete(challenge)) {
      // Lógica para canjear el cupón
      console.log('Canjeando cupón para:', challenge.title);
      // Aquí iría la lógica real de canje
    }
  }

  getChallengeDetailTitle(challenge: Challenge): string {
    const title = challenge.title.toLowerCase();
    if (title.includes('uva')) {
      return 'Tipos de uvas';
    } else if (title.includes('malbec')) {
      return 'Vinos comprados';
    } else if (title.includes('bebida')) {
      return 'Bebidas compradas';
    } else if (title.includes('cata')) {
      return 'Catas realizadas';
    }
    return 'Progreso';
  }

  shouldShowOnlyPurchased(challenge: Challenge): boolean {
    const title = challenge.title.toLowerCase();
    return title.includes('malbec') || title.includes('bebida');
  }

  getChallengeType(challenge: Challenge): string {
    const title = challenge.title.toLowerCase();
    if (title.includes('uva')) {
      return 'grapes';
    }
    return 'default';
  }

  hasDetailItems(challenge: Challenge): boolean {
    return (challenge.purchased && challenge.purchased.length > 0) || 
           (challenge.remaining && challenge.remaining.length > 0);
  }

  getCouponFor(challenge: Challenge): Coupon | undefined {
    if (!challenge.couponCode) {
      return undefined;
    }
    return this.coupons.find((c) => c.code === challenge.couponCode);
  }

  get selectedChallengeProgress(): number {
    if (!this.selectedChallenge) return 0;
    return (this.selectedChallenge.progressCurrent / this.selectedChallenge.progressTotal) * 100;
  }

  get selectedChallengeCoupon(): Coupon | undefined {
    return this.selectedChallenge ? this.getCouponFor(this.selectedChallenge) : undefined;
  }



  history: RewardHistory[] = [
    { title: 'Compra digital', ml: 750, date: '14 de enero del 2026' },
    { title: 'Club Tatú', ml: 2250, date: '12 de enero del 2026' },
    { title: 'Compra en el local', ml: 750, date: '3 de enero del 2026', badge: 'vence en 2 días' }
  ];

  expiredHistory: RewardHistory[] = [
    { title: 'Compra digital', ml: 1000, date: '28 de diciembre del 2025', badge: 'vencido' },
    { title: 'Club Tatú', ml: 2250, date: '20 de diciembre del 2025', badge: 'vencido' },
    { title: 'Compra en el local', ml: 750, date: '15 de diciembre del 2025', badge: 'vencido' },
    { title: 'Compra digital', ml: 500, date: '5 de diciembre del 2025', badge: 'vencido' },
    { title: 'Degustación', ml: 300, date: '28 de noviembre del 2025', badge: 'vencido' },
    { title: 'Club Tatú', ml: 2250, date: '20 de noviembre del 2025', badge: 'vencido' },
    { title: 'Compra en el local', ml: 900, date: '10 de noviembre del 2025', badge: 'vencido' }
  ];

  get nextTierProgress(): number {
    const total = this.summary.ml + this.summary.remainingToNext;
    if (total <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.summary.ml / total) * 100));
  }

  toggleExpiredHistory(): void {
    this.showExpiredHistory = !this.showExpiredHistory;
  }

  get displayedHistory(): RewardHistory[] {
    return this.showExpiredHistory 
      ? [...this.history, ...this.expiredHistory]
      : this.history;
  }
}
