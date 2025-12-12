import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

export interface Filter {
  type: 'select' | 'select-search' | 'range' | 'checkbox' | 'price-range';
  label: string;
  key: string;
  options?: any[];
  min?: number;
  max?: number;
  value?: any;
  open?: boolean;
  bars?: number[];
  showAllOptions?: boolean;
  searchTerm?: string;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnChanges {

  @Input() placeholder: string = 'Buscar productos en...';
  @Input() initialCategoryKey: string = '';
  @Input() initialCategoryName: string = '';
  @Input() products: any[] = []; // productos que llegan del componente Products

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() categoryChange = new EventEmitter<{ key: string; name: string }>();
  @Output() applyFilters = new EventEmitter<{ query: string; filters: Filter[] }>();

  @Input() categories: { key: string; name: string }[] = [];
  @Input() isCategorySelectionDisabled: boolean = false;

  query: string = '';
  showFilters: boolean = false;
  showCategory: boolean = false;
  private backupFilters: { common: Filter[]; [key: string]: Filter[] } = { common: [] };

  selectedCategory = { key: '', name: '' };

  commonFilters: Filter[] = [
    { key: 'price', label: 'Precio', type: 'price-range', min: 0, max: 50000, value: [0, 50000], bars: [] },
    { key: 'availability', label: 'Disponibilidad', type: 'checkbox', options: ['En stock', 'Agotado'], value: [] }
  ];

  categoryFilters: { [key: string]: Filter[] } = {
    wine: [
      { key: 'type', label: 'Tipo', type: 'checkbox', options: [], value: [] },
      { key: 'origin', label: 'País', type: 'select', options: ['Argentina','Chile','Francia'], value: '' },
      { key: 'year', label: 'Año', type: 'select', options: [2024,2023,2022,2021,2020,2019,2018], value: '' },
      { key: 'bodega', label: 'Bodega', type: 'select-search', options: [], value: [], searchTerm: '' }
    ],
    beer: [
      { key: 'type', label: 'Tipo', type: 'checkbox', options: [], value: [] },
      { key: 'origin', label: 'País', type: 'select', options: ['Argentina','Alemania','Bélgica'], value: '' },
      { key: 'size', label: 'Tamaño', type: 'select', options: ['330ml','500ml','1L'], value: '' }
    ],
    whisky: [
      { key: 'age', label: 'Años de añejamiento', type: 'select', options: ['8','12','18','21'], value: '' },
      { key: 'origin', label: 'País', type: 'select', options: ['Escocia','Irlanda','EE.UU.'], value: '' }
    ]
  };

  // -------------------------------------------------------------
  // INIT
  // -------------------------------------------------------------
  ngOnInit() {
    if (!this.categories || this.categories.length === 0) {
    this.categories = [
      { key: 'wine', name: 'Vinos' },
      { key: 'beer', name: 'Cervezas' },
      { key: 'whisky', name: 'Whiskys' },
      { key: 'grocery', name: 'Almacén' },
      { key: 'accessories', name: 'Accesorios' }
    ];
  }

    this.selectedCategory = { key: this.initialCategoryKey, name: this.initialCategoryName };

    // Inicializar select-search
    Object.values(this.categoryFilters).forEach(filters => {
      filters.forEach(f => {
        if (f.type === 'select-search') {
          f.value = f.value || [];
          f.searchTerm = f.searchTerm || '';
          f.options = f.options || [];
        }
        if (f.type === 'select' || f.type === 'select-search') {
          f.showAllOptions = false;
        }
      });
    });

    this.updateDynamicFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products']) {
      this.updateDynamicFilters();
    }

    if (changes['initialCategoryKey'] && !changes['initialCategoryKey'].firstChange) {
      this.selectedCategory = { key: this.initialCategoryKey, name: this.initialCategoryName };
      this.emitFilters();
    }
  }

  // -------------------------------------------------------------
  // FILTROS DINÁMICOS
  // -------------------------------------------------------------
  updateDynamicFilters() {
    if (!this.products || this.products.length === 0) return;
    const filters = this.categoryFilters[this.selectedCategory.key];
    if (!filters) return;

    // 🔹 FILTRO TIPO
    const typeFilter = filters.find(f => f.key === 'type');
    if (typeFilter) {
      typeFilter.options = Array.from(new Set(this.products.map(p => p.type).filter(t => !!t)));
    }

    // 🔹 SELECT-SEARCH (como bodega o brand)
    const selectSearchFilter = filters.find(f => f.type === 'select-search');
    if (selectSearchFilter) {
      selectSearchFilter.options = Array.from(new Set(this.products.map(p => p.brand).filter(b => !!b)));
    }

    // 🔹 FILTRO PRECIO + BARS dinámicas
// 🔹 FILTRO PRECIO DINÁMICO CON HISTOGRAMA
const priceFilter = this.commonFilters.find(f => f.key === 'price');
if (priceFilter) {
  const prices = this.products.map(p => p.price).filter(p => p != null);
  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    priceFilter.min = minPrice;
    priceFilter.max = maxPrice;
    priceFilter.value = [minPrice, maxPrice];

    // 🔹 calcular barras del histograma
    const numBars = 12; // cantidad de barras
    const bars = new Array(numBars).fill(0);
    const barWidth = (maxPrice - minPrice) / numBars || 1;

    prices.forEach(p => {
      let index = Math.floor((p - minPrice) / barWidth);
      if (index >= numBars) index = numBars - 1;
      bars[index]++;
    });

    // 🔹 normalizar alturas para porcentaje
    const maxCount = Math.max(...bars);
    priceFilter.bars = bars.map(b => (b / maxCount) * 100); // ahora altura en %
  }
}

  }

  get activeFilters(): Filter[] {
    const specific = this.categoryFilters[this.selectedCategory.key] || [];
    return [...this.commonFilters, ...specific];
  }

  // -------------------------------------------------------------
  // UI TOGGLES
  // -------------------------------------------------------------
  toggleFilters() { 
    if (!this.showFilters) {
      this.backupFilters = {
        common: JSON.parse(JSON.stringify(this.commonFilters)),
        ...Object.fromEntries(Object.entries(this.categoryFilters).map(([k,v]) => [k, JSON.parse(JSON.stringify(v))]))
      };
    }
    this.showFilters = !this.showFilters;
  }

  toggleCategory() { this.showCategory = !this.showCategory; }

  selectCategory(category: { key: string; name: string }) {
    this.selectedCategory = category;
    this.showCategory = false;
    this.query = '';
    this.search.emit('');
    this.categoryChange.emit(category);
    this.updateDynamicFilters();
  }

  // -------------------------------------------------------------
  // SEARCH
  // -------------------------------------------------------------
  onSearch(): void { this.search.emit(this.query?.trim() || ''); }

  // -------------------------------------------------------------
  // FILTER HANDLING
  // -------------------------------------------------------------
  toggleOption(filter: Filter, option: string) {
    if (!filter.value) filter.value = [];
    const idx = filter.value.indexOf(option);
    if (idx > -1) filter.value.splice(idx,1);
    else filter.value.push(option);
  }

  toggleFilter(filter: Filter) { filter.open = !filter.open; }

  emitFilters() { this.filterChange.emit(this.activeFilters); }

  toggleShowAllOptions(filter: Filter) {
    filter.showAllOptions = !filter.showAllOptions;
    this.emitFilters();
  }

  // -------------------------------------------------------------
  // PRICE SLIDER
  // -------------------------------------------------------------
  updatePrice(filter: Filter, index: number, value: number) {
    const min = filter.value[0];
    const max = filter.value[1];
    if (index === 0) filter.value = [Math.min(value, max), max];
    else filter.value = [min, Math.max(value, min)];
  }

  // -------------------------------------------------------------
  // PANEL BUTTONS
  // -------------------------------------------------------------
  closeFilters() {
    if (this.backupFilters.common) this.commonFilters = JSON.parse(JSON.stringify(this.backupFilters.common));
    for (const [key, filters] of Object.entries(this.categoryFilters)) {
      if (this.backupFilters[key]) this.categoryFilters[key] = JSON.parse(JSON.stringify(this.backupFilters[key]));
    }
    this.activeFilters.forEach(f => f.open = false);
    this.showFilters = false;
    this.query = '';
  }

  clearFilters() {
    this.commonFilters.forEach(f => {
      if (f.type === 'checkbox') f.value = [];
      else if (f.type === 'range' || f.type === 'price-range') f.value = [0,50000];
      else f.value = '';
    });

    Object.values(this.categoryFilters).forEach(filters => {
      filters.forEach(f => {
        if (f.type === 'checkbox') f.value = [];
        else if (f.type === 'range') f.value = [0,50000];
        else f.value = '';
      });
    });

    this.query = '';
    this.emitFilters();
  }

  applyFilterChanges() {
    this.emitFilters();
    this.applyFilters.emit({ query: this.query, filters: this.activeFilters });
    this.applyFilters.emit({ query: this.query?.trim() || '', filters: this.activeFilters });
    this.activeFilters.forEach(f => f.open = false);
    this.showFilters = false;
  }
}
