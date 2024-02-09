import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentdModalComponent } from './contentd-modal.component';

describe('ContentdModalComponent', () => {
  let component: ContentdModalComponent;
  let fixture: ComponentFixture<ContentdModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentdModalComponent]
    });
    fixture = TestBed.createComponent(ContentdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
