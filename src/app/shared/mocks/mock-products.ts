import { Product } from '../models/product.model';

export const MOCK_WINES: Product[] = [
  {
    id: 1,
    content: 750,
    unit: 'ml',
    productType: 'wine',
    imageUrl: 'assets/image 12.png',
    isNew: true,
    brand: 'Cafayate',
    name: 'Vino Blanco Cafayate 750 ml',
    oldPrice: 7529,
    price: 5029,
    discount: 15,
    installment: '6 cuotas sin interés de $1780,00',
    rating: 4.8,
    reviewsCount: 5,
    pricePerLiter: '$9.010,50',
    year: 2023,
    origin: 'Argentina',
    type: 'Blanco',
    body: 100,
    acidity: 50,
    tannins: 80,
    sweetness: 10,
    wineryDescription: 'Testeo de la descripción',
    maridajes: ['Carnes Rojas', 'Quesos Curados', 'Pastas con Salsa Roja'],
    color: 'Amarillo pálido con reflejos verdosos',
    aroma: 'Notas cítricas y florales',
    gusto: 'Fresco, frutado y equilibrado',
    barrica: '6 meses',
    servicio: 'Entre 8°C y 10°C'
  },
  {
    id: 2,
    content: 750,
    unit: 'ml',
    productType: 'wine',
    imageUrl: 'assets/image 12.png',
    brand: 'Cafayate',
    name: 'Vino Tinto Malbec Cafayate 750 ml',
    price: 5035,
    installment: '6 cuotas sin interés de $1781,00',
    rating: 4.8,
    reviewsCount: 5,
    pricePerLiter: '$9.010,50',
    variety: 'Malbec',
    year: 2023,
    region: 'Salta',
    alcohol: 13.5,
    type: 'Tinto',
    origin: 'Argentina',
    bodega_id: 1,
    body: 100,
    acidity: 50,
    tannins: 80,
    sweetness: 10,
    maridajes: ['Asado', 'Comida Criolla', 'Guisos'],
    color: 'Rojo intenso con matices violáceos',
    aroma: 'Aromas a frutos rojos y especias',
    gusto: 'Estructurado, con taninos suaves y final persistente',
    servicio: '16°C'
  }
];

export const MOCK_BEERS: Product[] = [
  {
    id: 3,
    content: 500,
    unit: 'ml',
    productType: 'beer',
    imageUrl: 'assets/beer1.png',
    isNew: true,
    brand: 'Patagonia',
    name: 'Cerveza IPA 500 ml',
    price: 1800,
    discount: 10,
    rating: 4.7,
    reviewsCount: 32,
    pricePerLiter: '$3.600,00',
    origin: 'Argentina',
    type: 'IPA',
    ibu: 45,
    container: 'Botella'
  }
];

export function getMockProducts(): Product[] {
  return [...MOCK_WINES, ...MOCK_BEERS];
}
