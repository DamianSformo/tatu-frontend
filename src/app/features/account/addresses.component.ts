import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Address {
  alias: string;
  direccion: string;
  pisoDepto?: string;
  indicaciones?: string;
  tipo: 'Casa' | 'Trabajo' | 'Otro';
  principal: boolean;
}

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent {
  addresses: Address[] = [];

  constructor(private router: Router) {
    this.loadAddresses();
  }

  loadAddresses() {
    const stored = localStorage.getItem('addresses');
    if (stored) {
      this.addresses = JSON.parse(stored);
    } else {
      // Demo data
      this.addresses = [
        {
          alias: 'Casa',
          direccion: 'Av. Murias 1234',
          pisoDepto: '8B',
          indicaciones: 'Frente a la plaza',
          tipo: 'Casa',
          principal: true
        },
        {
          alias: 'Oficina',
          direccion: 'Av. Corrientes 2233',
          pisoDepto: 'Piso 5 Depto B',
          tipo: 'Trabajo',
          principal: false
        }
      ];
      localStorage.setItem('addresses', JSON.stringify(this.addresses));
    }
  }

  startAdd(): void {
    this.router.navigate(['/direcciones/nueva']);
  }

  editAddress(idx: number): void {
    this.router.navigate(['/direcciones/editar', idx]);
  }

  iconFor(tipo: Address['tipo']): string {
    if (tipo === 'Trabajo') return 'briefcase';
    if (tipo === 'Casa') return 'house';
    return 'map-pin';
  }
}
