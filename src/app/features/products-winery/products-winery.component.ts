import { Component, OnInit } from '@angular/core';
import { Filter } from '../../shared/search-filter/search-filter.component';
import { Product, WineProduct, BeerProduct, ListProduct } from '../../shared/models/product.model';
import { getMockProducts } from '../../shared/mocks/mock-products';
import { mapToListProduct } from '../../shared/utils/product-mappers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-winery',
  templateUrl: './products-winery.component.html',
  styleUrls: ['./products-winery.component.scss']
})
export class ProductsWineryComponent implements OnInit {

  products: ListProduct[] = [];
    filteredProducts: ListProduct[] = [];
    categoryName: string = '';
    selectedCategoryKey: string = '';
    brandName: string = '';
      // 🔹 Nuevo: guarda el término de búsqueda
    searchTerm: string = '';

     constructor(private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      const savedCategory = sessionStorage.getItem('selectedCategory');

      this.route.paramMap.subscribe(params => {
      const brand = params.get('brandName');
      if (brand) {
        this.brandName = brand;
        }
      });

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
      // Si hay brandName, filtrar por marca
      if (this.brandName) {
        filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === this.brandName.toLowerCase());
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
          case 'price':
            const [min, max] = f.value;
            result = result.filter(p => p.price >= min && p.price <= max);
            break;
          case 'origin':
            if (f.value) result = result.filter(p => p.origin === f.value);
            break;
          case 'type':
            if (f.value && f.value.length > 0)
              result = result.filter(p => f.value.includes(p.type));
            break;
          case 'year':
            if (f.value) result = result.filter((p: any) => p.year === f.value);
            break;
        }
      });
  
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
  