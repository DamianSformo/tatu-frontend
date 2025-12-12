import { Product, ListProduct } from '../models/product.model';

export function mapToListProduct(p: Product): ListProduct {
  return {
    id: p.id,
    name: p.name,
    brand: (p as any).brand,
    productType: p.productType,
    price: p.price,
    oldPrice: (p as any).oldPrice,
    imageUrl: (p as any).imageUrl,
    isNew: (p as any).isNew,
    pricePerLiter: (p as any).pricePerLiter,
    discount: (p as any).discount,
    installment: (p as any).installment,
    origin: (p as any).origin,
    type: (p as any).type,
    year: (p as any).year,
  };
}
