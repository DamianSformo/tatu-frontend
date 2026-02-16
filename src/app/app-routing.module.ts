import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { ProductsWineryComponent } from './features/products-winery/products-winery.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AccountComponent } from './features/account/account.component';
import { ProfileComponent } from './features/profile/profile.component';
import { PersonalInfoComponent } from './features/account/personal-info.component';
import { AddressesComponent } from './features/account/addresses.component';
import { AddressFormComponent } from './features/account/address-form.component';
import { PaymentsComponent } from './features/account/payments.component';
import { RewardsComponent } from './features/account/rewards.component';
import { CouponsComponent } from './features/account/coupons.component';
import { PurchasesComponent } from './features/account/purchases.component';
import { SubscriptionsComponent } from './features/subscriptions/subscriptions.component';
import { MySubscriptionComponent } from './features/account/my-subscription.component';

const routes: Routes = [
  { path: 'bebidas/vinos', component: ProductsComponent },
  { path: 'bebidas/cervezas', component: ProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'brand/:brandName', component: ProductsWineryComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cuenta', component: AccountComponent },
  { path: 'cuenta/datos-personales', component: PersonalInfoComponent },
  { path: 'direcciones', component: AddressesComponent },
  { path: 'direcciones/nueva', component: AddressFormComponent },
  { path: 'direcciones/editar/:id', component: AddressFormComponent },
  { path: 'metodos-pago', component: PaymentsComponent },
  { path: 'recompensas', component: RewardsComponent },
  { path: 'cupones', component: CouponsComponent },
  { path: 'compras', component: PurchasesComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'suscripcion', component: SubscriptionsComponent },
  { path: 'mi-suscripcion', component: MySubscriptionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
