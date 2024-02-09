import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterMessageComponent } from './alter-message.component';

describe('AlterMessageComponent', () => {
  let component: AlterMessageComponent;
  let fixture: ComponentFixture<AlterMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlterMessageComponent]
    });
    fixture = TestBed.createComponent(AlterMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
