
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user = {
    name: 'Damián'
  };

  quickCards = [
    { title: 'Mi cuenta', icon: 'user', path: '/cuenta' },
    { title: 'Club Tatú', icon: 'crown', path: '/mi-suscripcion' },
    { title: 'Desafíos', icon: 'gift', path: '/recompensas' },
    { title: 'Cupones', icon: 'tag', path: '/cupones' },
  ];

  prefs = [
    { icon: 'map-pin-house', label: 'Direcciones', path: '/direcciones' },
    { icon: 'credit_card', label: 'Métodos de pago', path: '/metodos-pago' }
  ];
  navigateToPref(item: { path?: string }): void {
    if (item.path) {
      this.router.navigate([item.path]);
    }
  }

  activity = [
    { icon: 'package', label: 'Compras', path: '/compras' }
  ];

    other = [
    { icon: 'log-out', label: 'Cerrar sesión' },
    { icon: 'trash-2', label: 'Eliminar cuenta', danger: true }
  ];
  

  constructor(private router: Router) {}

  navigateToActivity(item: { path?: string }): void {
    if (item.path) {
      this.router.navigate([item.path]);
    }
  }

  navigateTo(card: { path?: string }): void {
    if (card.path) {
      this.router.navigate([card.path]);
    }
  }
}
