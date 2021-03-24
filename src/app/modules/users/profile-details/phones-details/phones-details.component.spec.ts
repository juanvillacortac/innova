import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonesDetailsComponent } from './phones-details.component';

describe('PhonesDetailsComponent', () => {
  let component: PhonesDetailsComponent;
  let fixture: ComponentFixture<PhonesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhonesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
