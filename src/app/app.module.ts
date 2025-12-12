import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SearchFilterComponent } from './shared/search-filter/search-filter.component';
import { ProductCardComponent } from './shared/product-card/product-card.component';
import { ProductListComponent } from './shared/product-list/product-list.component';
import { CartComponent } from './shared/cart/cart.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ProductsWineryComponent } from './features/products-winery/products-winery.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SearchFilterComponent,
    ProductCardComponent,
    ProductListComponent,
    CartComponent,
    ProductsComponent,
    ProductDetailComponent,
    FilterPipe,
    ProductsWineryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
