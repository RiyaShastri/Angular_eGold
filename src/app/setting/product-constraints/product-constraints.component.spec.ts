import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConstraintsComponent } from './product-constraints.component';

describe('ProductConstraintsComponent', () => {
  let component: ProductConstraintsComponent;
  let fixture: ComponentFixture<ProductConstraintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductConstraintsComponent]
    });
    fixture = TestBed.createComponent(ProductConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
