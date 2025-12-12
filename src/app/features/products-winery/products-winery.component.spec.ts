import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsWineryComponent } from './products-winery.component';

describe('ProductsWineryComponent', () => {
  let component: ProductsWineryComponent;
  let fixture: ComponentFixture<ProductsWineryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsWineryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsWineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
