import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

export interface Filter {
  type: 'select' | 'select-search' | 'range' | 'checkbox' | 'price-range' | 'radio';
  label: string;
  key: string;
  options?: any[];
  optionsWithCount?: { label: string; value: string; count: number }[];
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
    { key: 'order', label: 'Ordenar por', type: 'radio', options: ['Precio: menor a mayor', 'Precio: mayor a menor'], value: '' },
    { key: 'price', label: 'Precio', type: 'price-range', min: 0, max: 50000, value: [0, 50000], bars: [] }
  ];

  categoryFilters: { [key: string]: Filter[] } = {
    wine: [
      { key: 'type', label: 'Tipo', type: 'checkbox', options: [], value: [] },
      { key: 'variety', label: 'Uva', type: 'select', options: [], value: '' },
      { key: 'year', label: 'Año', type: 'select', options: [], value: '' },
      { key: 'origin', label: 'País', type: 'select', options: [], value: '' },
      { key: 'region', label: 'Región', type: 'select', options: [], value: '' },
      { key: 'bodega', label: 'Bodega', type: 'select-search', options: [], value: [], searchTerm: '' },
      { key: 'maridajes', label: 'Maridaje', type: 'checkbox', options: [], value: [] }
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

    // 🔹 Función auxiliar para obtener productos filtrados excluyendo un filtro específico
    // Solo considera los filtros concatenados: type, variety, year, origin, region, maridajes, bodega
    const getFilteredProductsExcluding = (excludeKey: string) => {
      let filtered = [...this.products];
      
      filters.forEach(f => {
        if (f.key === excludeKey) return;
        
        // Solo aplicar filtros concatenados
        if (!['type', 'variety', 'year', 'origin', 'region', 'maridajes', 'bodega'].includes(f.key)) return;
        
        if (f.type === 'checkbox' && f.value && f.value.length > 0) {
          if (f.key === 'maridajes') {
            filtered = filtered.filter(p => Array.isArray(p.maridajes) && p.maridajes.some((m: string) => f.value.includes(m)));
          } else {
            filtered = filtered.filter(p => f.value.includes(p[f.key]));
          }
        }
        if ((f.type === 'select' || f.type === 'select-search') && f.value && (Array.isArray(f.value) ? f.value.length : f.value !== '')) {
          if (Array.isArray(f.value)) {
            filtered = filtered.filter(p => f.value.includes(String(p[f.key === 'bodega' ? 'brand' : f.key])));
          } else {
            filtered = filtered.filter(p => String(p[f.key === 'bodega' ? 'brand' : f.key]) === String(f.value));
          }
        }
      });
      
      return filtered;
    };

    // 🔹 FILTRO TIPO - siempre disponible (NO concatenado con otros)
    const typeFilter = filters.find(f => f.key === 'type');
    if (typeFilter) {
      const allTypes = Array.from(new Set(this.products.map(p => p.type).filter(t => !!t)));
      typeFilter.options = allTypes;
      
      // Calcular conteo usando TODOS los productos (no filtrados)
      typeFilter.optionsWithCount = allTypes.map(t => ({
        label: t,
        value: t,
        count: this.products.filter(p => p.type === t).length
      }));
    }

    // 🔹 FILTRO MARIDAJE dinámico (solo vinos) - concatenado
    const maridajeFilter = filters.find(f => f.key === 'maridajes');
    if (maridajeFilter) {
      const filteredForMaridaje = getFilteredProductsExcluding('maridajes');
      
      // Obtener todos los maridajes únicos de todos los productos
      const allMaridajes = this.products
        .map(p => Array.isArray(p.maridajes) ? p.maridajes : [])
        .reduce((acc, arr) => acc.concat(arr), []);
      const uniqueMaridajes = Array.from(new Set(allMaridajes.filter((m: string) => !!m))) as string[];
      
      // Calcular conteo basado en productos filtrados
      maridajeFilter.optionsWithCount = uniqueMaridajes.map(m => ({
        label: m,
        value: m,
        count: filteredForMaridaje.filter(p => Array.isArray(p.maridajes) && p.maridajes.includes(m)).length
      }));
      maridajeFilter.options = uniqueMaridajes;
    }

    // 🔹 FILTRO ORIGIN dinámico con conteo - concatenado
    const originFilter = filters.find(f => f.key === 'origin');
    if (originFilter && originFilter.type === 'select') {
      const filteredForOrigin = getFilteredProductsExcluding('origin');
      const allOrigins = Array.from(new Set(this.products.map(p => p.origin).filter(o => !!o)));
      
      originFilter.optionsWithCount = allOrigins
        .map(o => ({
          label: o,
          value: o,
          count: filteredForOrigin.filter(p => p.origin === o).length
        }));
      originFilter.options = originFilter.optionsWithCount.map(opt => opt.value);
    }

    // 🔹 FILTRO REGION dinámico con conteo - concatenado
    const regionFilter = filters.find(f => f.key === 'region');
    if (regionFilter && regionFilter.type === 'select') {
      const filteredForRegion = getFilteredProductsExcluding('region');
      const allRegions = Array.from(new Set(this.products.map(p => p.region).filter(r => !!r)));
      
      regionFilter.optionsWithCount = allRegions
        .map(r => ({
          label: r,
          value: r,
          count: filteredForRegion.filter(p => p.region === r).length
        }));
      regionFilter.options = regionFilter.optionsWithCount.map(opt => opt.value);
    }

    // 🔹 FILTRO VARIETY (tipo de uva) dinámico con conteo - concatenado
    const varietyFilter = filters.find(f => f.key === 'variety');
    if (varietyFilter && varietyFilter.type === 'select') {
      const filteredForVariety = getFilteredProductsExcluding('variety');
      const allVarieties = Array.from(new Set(this.products.map(p => p.variety).filter(v => !!v)));
      
      varietyFilter.optionsWithCount = allVarieties
        .map(v => ({
          label: v,
          value: v,
          count: filteredForVariety.filter(p => p.variety === v).length
        }));
      varietyFilter.options = varietyFilter.optionsWithCount.map(opt => opt.value);
    }

    // 🔹 FILTRO YEAR dinámico con conteo - concatenado
    const yearFilter = filters.find(f => f.key === 'year');
    if (yearFilter && yearFilter.type === 'select') {
      const filteredForYear = getFilteredProductsExcluding('year');
      const allYears = Array.from(new Set(this.products.map(p => p.year).filter((y: any) => !!y))).sort((a, b) => b - a);
      
      yearFilter.optionsWithCount = allYears
        .map(y => ({
          label: String(y),
          value: String(y),
          count: filteredForYear.filter(p => p.year === y).length
        }));
      yearFilter.options = yearFilter.optionsWithCount.map(opt => opt.value);
    }

    // 🔹 SELECT-SEARCH (como bodega o brand) - concatenado
    const selectSearchFilter = filters.find(f => f.type === 'select-search');
    if (selectSearchFilter) {
      const filteredForBrand = getFilteredProductsExcluding(selectSearchFilter.key);
      const allBrands = Array.from(new Set(this.products.map(p => p.brand).filter(b => !!b)));
      
      selectSearchFilter.optionsWithCount = allBrands.map(b => ({
        label: b,
        value: b,
        count: filteredForBrand.filter(p => p.brand === b).length
      }));
      selectSearchFilter.options = allBrands;
    }

    // 🔹 FILTRO PRECIO DINÁMICO CON HISTOGRAMA - NO concatenado
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
        const numBars = 12;
        const bars = new Array(numBars).fill(0);
        const barWidth = (maxPrice - minPrice) / numBars || 1;

        prices.forEach(p => {
          let index = Math.floor((p - minPrice) / barWidth);
          if (index >= numBars) index = numBars - 1;
          bars[index]++;
        });

        const maxCount = Math.max(...bars);
        priceFilter.bars = bars.map(b => (b / maxCount) * 100);
      }
    }

  }

  get activeFilters(): Filter[] {
    const specific = this.categoryFilters[this.selectedCategory.key] || [];
    return [...this.commonFilters, ...specific];
  }

  // Devuelve la cantidad de productos que cumplen con los filtros y búsqueda actual
  get filteredProductsCount(): number {
    if (!this.products) return 0;
    let filtered = this.products;
    // Filtros comunes
    this.commonFilters.forEach(f => {
      if (f.type === 'price-range' && f.value) {
        filtered = filtered.filter(p => p.price >= f.value[0] && p.price <= f.value[1]);
      }
    });
    // Filtros específicos
    const specific = this.categoryFilters[this.selectedCategory.key] || [];
    specific.forEach(f => {
      if (f.type === 'checkbox' && f.value && f.value.length) {
        if (f.key === 'maridajes') {
          filtered = filtered.filter(p => Array.isArray(p.maridajes) && p.maridajes.some((m: string) => f.value.includes(m)));
        } else {
          filtered = filtered.filter(p => f.value.includes(p[f.key]));
        }
      }
      if ((f.type === 'select' || f.type === 'select-search') && f.value && (Array.isArray(f.value) ? f.value.length : f.value !== '')) {
        const productKey = f.key === 'bodega' ? 'brand' : f.key;
        if (Array.isArray(f.value)) {
          filtered = filtered.filter(p => f.value.includes(String(p[productKey])));
        } else {
          filtered = filtered.filter(p => String(p[productKey]) === String(f.value));
        }
      }
    });
    // Búsqueda
    if (this.query && this.query.trim().length > 0) {
      const q = this.query.trim().toLowerCase();
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(q));
    }
    return filtered.length;
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
    
    // Actualizar filtros dinámicos si es un filtro concatenado
    if (['type', 'variety', 'year', 'origin', 'region', 'maridajes', 'bodega'].includes(filter.key)) {
      this.updateDynamicFilters();
    }
  }

  toggleFilter(filter: Filter) { filter.open = !filter.open; }

  // Método auxiliar para obtener opciones con conteo
  getOptionsWithCount(filter: Filter): { label: string; value: string; count: number }[] {
    if (filter.optionsWithCount && filter.optionsWithCount.length > 0) {
      return filter.optionsWithCount;
    }
    if (filter.options && filter.options.length > 0) {
      return filter.options.map(o => ({ value: o, label: o, count: 1 }));
    }
    return [];
  }

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
      else if (f.type === 'range' || f.type === 'price-range') {
        // recalcular min y max dinámico
        const prices = this.products.map(p => p.price).filter(p => p != null);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          f.value = [minPrice, maxPrice];
        } else {
          f.value = [0, 50000];
        }
      }
      else f.value = '';
    });

    Object.values(this.categoryFilters).forEach(filters => {
      filters.forEach(f => {
        if (f.type === 'checkbox') f.value = [];
        else if (f.type === 'range') {
          const prices = this.products.map(p => p.price).filter(p => p != null);
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            f.value = [minPrice, maxPrice];
          } else {
            f.value = [0, 50000];
          }
        }
        else f.value = '';
      });
    });

    this.query = '';
    this.updateDynamicFilters(); // Recalcular opciones disponibles
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
