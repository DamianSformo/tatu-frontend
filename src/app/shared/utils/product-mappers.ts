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
    region: (p as any).region,
    type: (p as any).type,
    variety: (p as any).variety,
    year: (p as any).year,
    maridajes: (p as any).maridajes,
  };
}
