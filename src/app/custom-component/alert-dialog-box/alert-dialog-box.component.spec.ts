import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AlertDialogBoxComponent } from "./alert-dialog-box.component";


describe('AlertDialogBoxComponent', () => {
  let component: AlertDialogBoxComponent;
  let fixture: ComponentFixture<AlertDialogBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertDialogBoxComponent]
    });
    fixture = TestBed.createComponent(AlertDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

