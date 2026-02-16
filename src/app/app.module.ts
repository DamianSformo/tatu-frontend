import { NgModule } from '@angular/core';
import { LucideAngularModule, icons } from 'lucide-angular';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { CheckoutComponent } from './features/checkout/checkout.component';
import { PlacesAutocompleteDirective } from './shared/directives/places-autocomplete.directive';
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
    ProductsWineryComponent,
    CheckoutComponent,
    PlacesAutocompleteDirective,
    AccountComponent,
    ProfileComponent,
    PersonalInfoComponent,
    AddressesComponent,
    AddressFormComponent,
    PaymentsComponent,
    RewardsComponent,
    CouponsComponent,
    PurchasesComponent,
    SubscriptionsComponent,
    MySubscriptionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    LucideAngularModule.pick(icons)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }