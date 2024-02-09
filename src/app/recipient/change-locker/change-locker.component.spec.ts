import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLockerComponent } from './change-locker.component';

describe('ChangeLockerComponent', () => {
  let component: ChangeLockerComponent;
  let fixture: ComponentFixture<ChangeLockerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeLockerComponent]
    });
    fixture = TestBed.createComponent(ChangeLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
