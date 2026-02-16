import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare const google: any;

interface Address {
  alias: string;
  direccion: string;
  pisoDepto?: string;
  indicaciones?: string;
  tipo: 'Casa' | 'Trabajo' | 'Otro';
  principal: boolean;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  form: Address = {
    alias: '',
    direccion: '',
    pisoDepto: '',
    indicaciones: '',
    tipo: 'Casa',
    principal: false
  };

  initialForm: Address = { ...this.form };
  formDirty = false;
  editIndex: number | null = null;
  isEditMode = false;
  touched: { [key: string]: boolean } = { direccion: false };
  tipoDropdownOpen = false;
  tipoOptions: Array<{ value: Address['tipo']; label: string; icon: string }> = [
    { value: 'Casa', label: 'Casa', icon: 'house' },
    { value: 'Trabajo', label: 'Trabajo', icon: 'briefcase' },
    { value: 'Otro', label: 'Otro', icon: 'map-pin' }
  ];
  direccionValid = false;
  direccionError = '';
  direccionLoading = false;
  direccionSuggestions: Array<{ placeId: string; label: string; formatted: string; components: any[] }> = [];
  private direccionDebounce?: number;
  private placesService: any;
  private sessionToken: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.editIndex = +params['id'];
        this.isEditMode = true;
        this.loadAddress();
      }
    });
  }

  loadAddress() {
    const mockAddresses: Address[] = JSON.parse(localStorage.getItem('addresses') || '[]');
    if (this.editIndex !== null && mockAddresses[this.editIndex]) {
      this.form = { ...mockAddresses[this.editIndex] };
      this.initialForm = { ...this.form };
      this.direccionValid = true;
    }
  }

  onInputChange() {
    this.formDirty =
      this.form.alias !== this.initialForm.alias ||
      this.form.direccion !== this.initialForm.direccion ||
      this.form.pisoDepto !== this.initialForm.pisoDepto ||
      this.form.indicaciones !== this.initialForm.indicaciones ||
      this.form.tipo !== this.initialForm.tipo ||
      this.form.principal !== this.initialForm.principal;
  }

  onDireccionInput(value: string) {
    this.form.direccion = value;
    this.onInputChange();
    this.direccionValid = false;
    this.direccionError = '';

    if (this.direccionDebounce) {
      window.clearTimeout(this.direccionDebounce);
    }

    if (!value || value.trim().length < 3) {
      this.direccionSuggestions = [];
      return;
    }

    this.direccionDebounce = window.setTimeout(() => {
      this.fetchPredictions(value.trim());
    }, 250);
  }

  onPlaceSelected(place: { formatted: string; components: any[] } | null) {
    if (!place) {
      this.direccionError = 'No pudimos validar la dirección. Probá otra vez.';
      this.direccionValid = false;
      return;
    }

    if (!this.hasStreetNumber({ address_components: place.components })) {
      this.direccionError = 'Seleccioná una dirección con altura (número).';
      this.direccionValid = false;
      return;
    }

    this.form.direccion = place.formatted || this.form.direccion;
    this.direccionValid = true;
    this.direccionError = '';
    this.onInputChange();
    this.direccionSuggestions = [];
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
  }

  onDireccionBlur() {
    this.onBlur('direccion');
    window.setTimeout(() => {
      this.direccionSuggestions = [];
    }, 150);
  }

  showDireccionInvalid(): boolean {
    return this.touched['direccion'] && !this.direccionValid && !this.isFieldEmpty('direccion');
  }

  onBlur(field: string) {
    this.touched[field] = true;
  }

  isFieldEmpty(field: 'direccion'): boolean {
    return !this.form[field] || this.form[field].trim() === '';
  }

  showError(field: 'direccion'): boolean {
    return this.touched[field] && this.isFieldEmpty(field);
  }

  isFormValid(): boolean {
    return !this.isFieldEmpty('direccion') && this.direccionValid;
  }

  canSave(): boolean {
    // En modo creación (nueva dirección), permitir guardar si el form es válido
    // En modo edición, requerir que haya cambios Y sea válido
    if (this.isEditMode) {
      return this.formDirty && this.isFormValid();
    }
    return this.isFormValid();
  }

  save() {
    if (!this.isFormValid()) {
      this.touched['direccion'] = true;
      return;
    }
    if (!this.canSave()) return;
    const addresses: Address[] = JSON.parse(localStorage.getItem('addresses') || '[]');
    
    if (this.form.principal) {
      addresses.forEach((a, i) => {
        if (i !== this.editIndex) a.principal = false;
      });
    }

    if (this.editIndex === null) {
      addresses.push(this.form);
    } else {
      addresses[this.editIndex] = this.form;
    }

    localStorage.setItem('addresses', JSON.stringify(addresses));
    alert('Dirección guardada (demo)');
    this.initialForm = { ...this.form };
    this.formDirty = false;
    this.router.navigate(['/direcciones']);
  }

  iconFor(tipo: Address['tipo']): string {
    if (tipo === 'Trabajo') return 'briefcase';
    if (tipo === 'Casa') return 'house';
    return 'map-pin';
  }

  toggleTipoDropdown() {
    this.tipoDropdownOpen = !this.tipoDropdownOpen;
  }

  selectTipo(tipo: Address['tipo']) {
    this.form.tipo = tipo;
    this.onInputChange();
  }

  getTipoLabel(): string {
    const option = this.tipoOptions.find(opt => opt.value === this.form.tipo);
    return option ? option.label : 'Seleccionar tipo';
  }

  private hasStreetNumber(place: any): boolean {
    const components = place?.address_components || [];
    const hasRoute = components.some((c: any) => c.types.includes('route'));
    const hasNumber = components.some((c: any) => c.types.includes('street_number'));
    return hasRoute && hasNumber;
  }

  private fetchPredictions(query: string) {
    if (!google?.maps?.places) {
      this.direccionError = 'Autocomplete no disponible';
      return;
    }

    this.direccionLoading = true;
    this.sessionToken = this.sessionToken || new google.maps.places.AutocompleteSessionToken();
    const autocomplete = new google.maps.places.AutocompleteService();

    autocomplete.getPlacePredictions(
      {
        input: query,
        types: ['address'],
        componentRestrictions: { country: 'ar' },
        sessionToken: this.sessionToken
      },
      (predictions: any[], status: string) => {
        if (status !== 'OK' || !predictions?.length) {
          this.direccionSuggestions = [];
          this.direccionLoading = false;
          return;
        }

        const limited = predictions.slice(0, 5);
        Promise.all(limited.map(p => this.fetchPlaceDetails(p.place_id)))
          .then(results => {
            this.direccionSuggestions = results.filter(Boolean) as Array<{ placeId: string; label: string; formatted: string; components: any[] }>;
            if (!this.direccionSuggestions.length) {
              this.direccionError = 'Seleccioná una dirección con altura (número).';
            }
          })
          .catch(() => {
            this.direccionSuggestions = [];
          })
          .finally(() => {
            this.direccionLoading = false;
          });
      }
    );
  }

  private fetchPlaceDetails(placeId: string): Promise<{ placeId: string; label: string; formatted: string; components: any[] } | null> {
    return new Promise(resolve => {
      if (!this.placesService) {
        this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
      }

      this.placesService.getDetails(
        {
          placeId,
          fields: ['address_components', 'formatted_address', 'geometry'],
          sessionToken: this.sessionToken
        },
        (place: any, status: string) => {
          if (status !== 'OK' || !place) return resolve(null);
          if (!this.hasStreetNumber(place)) return resolve(null);
          resolve({ placeId, label: place.formatted_address, formatted: place.formatted_address, components: place.address_components });
        }
      );
    });
  }

  deleteAddress() {
    if (this.editIndex === null) return;
    const addresses: Address[] = JSON.parse(localStorage.getItem('addresses') || '[]');
    addresses.splice(this.editIndex, 1);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    this.router.navigate(['/direcciones']);
  }
}
