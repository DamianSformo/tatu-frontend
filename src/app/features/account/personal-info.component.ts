import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent {
  form = {
    nombre: 'Damián',
    apellido: 'Ejemplo',
    documento: '30.123.456'
  };

  initialForm = { ...this.form };
  formDirty = false;
  touched = {
    nombre: false,
    apellido: false
  };

  ngOnInit() {
    // Watch for changes in the form
    // This is a simple approach for demo; for real forms use FormGroup
  }

  onInputChange() {
    this.formDirty =
      this.form.nombre !== this.initialForm.nombre ||
      this.form.apellido !== this.initialForm.apellido ||
      this.form.documento !== this.initialForm.documento;
  }

  onBlur(field: 'nombre' | 'apellido') {
    this.touched[field] = true;
  }

  isFieldEmpty(field: 'nombre' | 'apellido'): boolean {
    return !this.form[field] || this.form[field].trim() === '';
  }

  showError(field: 'nombre' | 'apellido'): boolean {
    return this.touched[field] && this.isFieldEmpty(field);
  }

  isFormValid(): boolean {
    return !this.isFieldEmpty('nombre') && !this.isFieldEmpty('apellido');
  }

  canSave(): boolean {
    return this.formDirty && this.isFormValid();
  }

  onSave(): void {
    if (!this.isFormValid()) {
      this.touched.nombre = true;
      this.touched.apellido = true;
      return;
    }
    // Solo demo: no hay backend
    alert('Datos guardados (demo)');
    this.initialForm = { ...this.form };
    this.formDirty = false;
  }
}
