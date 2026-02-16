import { Directive, ElementRef, EventEmitter, NgZone, OnInit, Output } from '@angular/core';

declare const google: any;

@Directive({
  selector: '[appPlacesAutocomplete]'
})
export class PlacesAutocompleteDirective implements OnInit {
  @Output() placeSelected = new EventEmitter<any>();

  private sessionToken: any;

  constructor(private el: ElementRef<HTMLInputElement>, private zone: NgZone) {}

  ngOnInit(): void {
    // If Google script is not loaded, skip silently (or console.warn if needed)
    if (typeof google === 'undefined' || !google.maps?.places) {
      return;
    }

    this.sessionToken = new google.maps.places.AutocompleteSessionToken();

    const autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, {
      fields: ['address_components', 'formatted_address', 'geometry'],
      types: ['address'],
      componentRestrictions: { country: 'ar' }, // ajusta país si corresponde
      sessionToken: this.sessionToken
    });

    autocomplete.addListener('place_changed', () => {
      this.zone.run(() => {
        this.placeSelected.emit(autocomplete.getPlace());
        // Nueva sesión para la próxima búsqueda (mejora la facturación de Places)
        this.sessionToken = new google.maps.places.AutocompleteSessionToken();
        autocomplete.setOptions({ sessionToken: this.sessionToken });
      });
    });
  }
}
