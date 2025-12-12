import { Component, OnInit } from '@angular/core';
import { Filter } from '../../shared/search-filter/search-filter.component';
import { Product, WineProduct, BeerProduct, ListProduct } from '../../shared/models/product.model';
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
      switch (categoryKey) {
        case 'wine':
          this.products = this.getWines().map(mapToListProduct);
          break;
        case 'beer':
          this.products = this.getBeers().map(mapToListProduct);
          break;
        default:
          this.products = [];
      }
  
      this.filteredProducts = [...this.products];
    }
  
    getWines(): WineProduct[] {
      return [
        {
          id: 1,
          imageUrl: 'assets/image 12.png',
          isNew: true,
          brand: 'CAFAYATE',
          name: 'Vino Blanco Cafayate 750 ml',
          price: 7529,
          installment: '6 cuotas sin interés de $1780,00',
          rating: 4.8,
          reviewsCount: 5,
          pricePerLiter: '$9.010,50',
          variety: 'Malbec',
          year: 2022,
          region: 'Salta',
          alcohol: 13.5,
          type: 'Blanco',
          origin: 'Argentina',
          productType: "wine",
        },
        {
          id: 2,
          imageUrl: 'assets/image 12.png',
          isNew: false,
          brand: 'CAFAYATE',
          name: 'Vino Tinto Malbec Cafayate 750 ml',
          oldPrice: 7529,
          price: 5029,
          discount: 15,
          installment: '6 cuotas sin interés de $1780,00',
          rating: 4.8,
          reviewsCount: 5,
          pricePerLiter: '$9.010,50',
          variety: 'Malbec',
          year: 2023,
          region: 'Salta',
          alcohol: 13.5,
          type: 'Tinto',
          origin: 'Argentina',
          productType: "wine"
        }
      ];
    }
  
    getBeers(): BeerProduct[] {
      return [
        {
          id: 3,
          imageUrl: 'assets/beer1.png',
          isNew: true,
          brand: 'Patagonia',
          name: 'Cerveza IPA 500 ml',
          price: 1800,
          discount: 10,
          rating: 4.7,
          reviewsCount: 32,
          pricePerLiter: '$3.600,00',
          type: 'IPA',
          ibu: 45,
          origin: 'Argentina',
          container: 'Botella 500ml',
          productType: 'beer',
        }
      ];
    }
  
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
  