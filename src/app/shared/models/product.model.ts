export type ProductType = "wine" | "beer";

/* ---------------------- */
/*       BASE PRODUCT     */
/* ---------------------- */
export interface BaseProduct {
  id: number;
  name: string;
  brand: string; //eliminar
  productType: ProductType;
  oldPrice?: number;
  discount?: number;
  price: number;
  pricePerLiter?: string;
  content?: number;
  unit?: string;
  installment?: string;
  imageUrl?: string;
  isNew?: boolean;
  rating?: number;
  reviewsCount?: number;
  origin?: string;
}

/* ---------------------- */
/*      WINE PRODUCT      */
/* ---------------------- */
export interface WineProduct extends BaseProduct {
  productType: "wine";
  bodega_id?: number;
  type?: string;
  variety?: string;
  year?: number;
  region?: string;
  alcohol?: number;
  wineryDescription?: string;
  maridajes?: string[];
  body?: number; 
  bodyLabel?: string;
  acidity?: number;
  acidityLabel?: string;
  tannins?: number;
  tanninsLabel?: string;
  sweetness?: number;
  sweetnessLabel?: string;
  color?: string;
  aroma?: string;
  gusto?: string;
  barrica?: string;
  servicio?: string;
  notasDeCata?: string;
}

/* ---------------------- */
/*      BEER PRODUCT      */
/* ---------------------- */
export interface BeerProduct extends BaseProduct {
  productType: "beer";

  type: string;
  ibu?: number;
  container?: string;
}

/* ---------------------- */
/*     UNIFIED PRODUCT    */
/* ---------------------- */
export type Product = WineProduct | BeerProduct;

/* ---------------------- */
/*     LIST (SUMMARY)     */
/* ---------------------- */
export interface ListProduct {
  id: number;
  name: string;
  brand?: string;
  productType: ProductType;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  isNew?: boolean;
  pricePerLiter?: string;
  discount?: number;
  installment?: string;
  // fields useful for filtering in lists
  origin?: string;
  region?: string;
  type?: string;
  variety?: string;
  year?: number;
  maridajes?: string[];
}
