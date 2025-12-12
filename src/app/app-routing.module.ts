import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { ProductsWineryComponent } from './features/products-winery/products-winery.component';

const routes: Routes = [
  { path: 'bebidas/vinos', component: ProductsComponent },
  { path: 'bebidas/cervezas', component: ProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'brand/:brandName', component: ProductsWineryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
