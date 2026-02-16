import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  user = {
    name: 'Damián',
    email: 'demo@ejemplo.com',
    celularNumber: '11 2345 6789',
    tier: 'Club Tatú',
    status: 'Activo'
  };

  options = [
    { icon: 'crown', title: 'Mi suscripción', subtitle: 'Gestiona tu plan Club Tatú', path: '/mi-suscripcion' },
    { icon: 'user', title: 'Datos personales', subtitle: 'Nombre, Apellido y DNI / CUIT', path: '/cuenta/datos-personales' },
    { icon: 'mail', title: 'E-mail', subtitle: this.user.email, path: '/cuenta/direcciones' },
    { icon: 'smartphone', title: 'Número de celular', subtitle: this.user.celularNumber, path: '/cuenta/metodos-pago' }
  ];

  constructor(private router: Router) {}

  goToPersonalInfo(): void {
    this.router.navigate(['cuenta/datos-personales']);
  }

  goBack(): void {
    this.router.navigate(['/perfil']);
  }

  openOption(option: { path?: string }): void {
    if (option.path) {
      this.router.navigate([option.path]);
    }
  }
}
