import { Component } from '@angular/core';

interface Purchase {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'entregado' | 'en_camino' | 'preparando';
  statusLabel: string;
  eta?: string;
  address: string;
  payment?: string;
}

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent {
  purchases: Purchase[] = [
    {
      id: 'PED-10231',
      date: '12 Dic 2025',
      items: 3,
      total: 15200,
      status: 'en_camino',
      statusLabel: 'En camino',
      eta: 'Llega hoy 18:00 - 20:00',
      address: 'Thames 1585, CABA',
      payment: 'Visa •• 3948'
    },
    {
      id: 'PED-10188',
      date: '28 Nov 2025',
      items: 2,
      total: 9800,
      status: 'entregado',
      statusLabel: 'Entregado',
      eta: 'Entregado el 30 Nov 2025',
      address: 'Medrano 321, CABA',
      payment: 'Mastercard •• 8123'
    },
    {
      id: 'PED-10145',
      date: '11 Nov 2025',
      items: 1,
      total: 5200,
      status: 'preparando',
      statusLabel: 'Preparando',
      eta: 'Despacha hoy 14:00',
      address: 'Billinghurst 700, CABA',
      payment: 'Mercado Pago'
    }
  ];

  statusClass(status: Purchase['status']): string {
    return `purchases__status--${status}`;
  }

  viewDetail(purchase: Purchase): void {
    // TODO: conectar con detalle de pedido
    console.log('Ver detalle', purchase.id);
  }
}
