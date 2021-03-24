import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivatesRoomsListComponent } from './derivates-rooms-list.component';

describe('DerivatesRoomsListComponent', () => {
  let component: DerivatesRoomsListComponent;
  let fixture: ComponentFixture<DerivatesRoomsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerivatesRoomsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivatesRoomsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
