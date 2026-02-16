import { Component, OnInit } from '@angular/core';
import { Filter } from '../../shared/search-filter/search-filter.component';
import { Product, WineProduct, BeerProduct, ListProduct } from '../../shared/models/product.model';
import { getMockProducts } from '../../shared/mocks/mock-products';
import { mapToListProduct } from '../../shared/utils/product-mappers';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: ListProduct[] = [];
  filteredProducts: ListProduct[] = [];
  categoryName: string = '';
  selectedCategoryKey: string = '';

    // 🔹 Nuevo: guarda el término de búsqueda
  searchTerm: string = '';

  // 🔹 Categorías que pertenecen a "Bebidas"
  private readonly bebidasCategories = ['wine', 'beer', 'whisky'];

  // 🔹 Obtiene el breadcrumb dinámicamente
  getBreadcrumb(): string {
    if (this.bebidasCategories.includes(this.selectedCategoryKey)) {
      return `Bebidas > ${this.categoryName}`;
    }
    return this.categoryName;
  }

  ngOnInit(): void {
    const savedCategory = sessionStorage.getItem('selectedCategory');
    if (savedCategory) {
      const category = JSON.parse(savedCategory);
      this.categoryName = category.name;
      this.selectedCategoryKey = category.key;
      this.loadProductsByCategory(category.key);
    }
  }

  onSearchTermCleared(query: string) {
  this.searchTerm = query; // 🔹 se actualizará a '' cuando cambie la categoría
}

  loadProductsByCategory(categoryKey: string) {
    const allProducts = getMockProducts();
    let filtered: Product[] = [];
    switch (categoryKey) {
      case 'wine':
        filtered = allProducts.filter(p => p.productType === 'wine');
        break;
      case 'beer':
        filtered = allProducts.filter(p => p.productType === 'beer');
        break;
      default:
        filtered = [];
    }
    this.products = filtered.map(mapToListProduct);
    this.filteredProducts = [...this.products];
  }

  // Los métodos getWines y getBeers han sido reemplazados por el uso de getMockProducts() externo.

  // 🔹 Se ejecuta solo cuando se presiona “Mostrar productos”
  onApplyFilters(event: { query: string; filters: Filter[] }) {
    const { query, filters } = event;

    this.searchTerm = query?.trim() || '';
    let result = [...this.products];

    // 🔸 Búsqueda
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        ((p as any).brand && (p as any).brand.toLowerCase().includes(q))
      );
    }

    // 🔸 Aplicación de filtros
    filters.forEach(f => {
      switch (f.key) {
        case 'order': {
          // Ordenamiento se aplica después de filtros
          break;
        }
        case 'price': {
          const [min, max] = f.value;
          result = result.filter(p => p.price >= min && p.price <= max);
          break;
        }
        case 'origin': {
          if (Array.isArray(f.value) && f.value.length > 0) {
            result = result.filter(p => f.value.includes(p.origin));
          } else if (f.value && !Array.isArray(f.value)) {
            result = result.filter(p => p.origin === f.value);
          }
          break;
        }
        case 'type': {
          if (f.value && f.value.length > 0)
            result = result.filter(p => f.value.includes(p.type));
          break;
        }
        case 'year': {
          if (Array.isArray(f.value) && f.value.length > 0) {
            result = result.filter((p: any) => f.value.includes(String(p.year)));
          } else if (f.value && !Array.isArray(f.value)) {
            result = result.filter((p: any) => String(p.year) === String(f.value));
          }
          break;
        }
        case 'variety': {
          if (Array.isArray(f.value) && f.value.length > 0) {
            result = result.filter(p => f.value.includes(String((p as any).variety)));
          } else if (f.value && !Array.isArray(f.value)) {
            result = result.filter(p => String((p as any).variety) === String(f.value));
          }
          break;
        }
        case 'maridajes': {
          if (f.value && f.value.length > 0) {
            result = result.filter(p => Array.isArray(p.maridajes) && p.maridajes.some((m: string) => f.value.includes(m)));
          }
          break;
        }
      }
    });

    // 🔸 Aplicar ordenamiento
    const orderFilter = filters.find(f => f.key === 'order');
    if (orderFilter && orderFilter.value) {
      if (orderFilter.value === 'Precio: menor a mayor') {
        result.sort((a, b) => a.price - b.price);
      } else if (orderFilter.value === 'Precio: mayor a menor') {
        result.sort((a, b) => b.price - a.price);
      }
    }

    this.filteredProducts = result;
  }

  // 🔹 Se ejecuta al cambiar categoría en el dropdown del filtro
  onCategoryChange(category: { key: string; name: string }) {
    console.log('Categoría seleccionada desde filtro:', category);
    this.categoryName = category.name;
    this.selectedCategoryKey = category.key;
    this.loadProductsByCategory(category.key);
  }

  // 🔹 Para recibir categoría desde el sidebar (si se usa)
  updateCategory(category: { key: string; name: string }) {
    this.categoryName = category.name;
    this.selectedCategoryKey = category.key;
    console.log('Categoría recibida desde Sidebar:', category);
    this.loadProductsByCategory(category.key);
  }
}
