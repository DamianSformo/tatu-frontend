import { Component } from '@angular/core';

interface PaymentMethod {
  alias: string;
  last4: string;
  brand: string;
  exp: string;
  principal: boolean;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent {
  methods: PaymentMethod[] = [
    { alias: 'Visa personal', last4: '4242', brand: 'visa', exp: '12/27', principal: true }
  ];

  form: PaymentMethod = {
    alias: '',
    last4: '',
    brand: 'visa',
    exp: '',
    principal: false
  };

  showForm = false;
  editIndex: number | null = null;

  startAdd(): void {
    this.editIndex = null;
    this.form = {
      alias: '',
      last4: '',
      brand: 'visa',
      exp: '',
      principal: this.methods.length === 0
    };
    this.showForm = true;
  }

  editMethod(idx: number): void {
    this.editIndex = idx;
    this.form = { ...this.methods[idx] };
    this.showForm = true;
  }

  save(): void {
    const payload = { ...this.form };
    if (payload.principal) {
      this.methods = this.methods.map((m, i) => ({ ...m, principal: i === this.editIndex }));
    }

    if (this.editIndex === null) {
      this.methods = [...this.methods, payload];
    } else {
      this.methods = this.methods.map((m, i) => (i === this.editIndex ? payload : m));
    }

    this.editIndex = null;
    this.showForm = false;
    this.startAdd();
    alert('Método guardado (demo)');
  }

  cancelForm(): void {
    this.showForm = false;
    this.editIndex = null;
  }
}
