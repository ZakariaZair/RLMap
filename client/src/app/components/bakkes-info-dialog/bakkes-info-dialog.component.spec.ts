import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakkesInfoDialogComponent } from './bakkes-info-dialog.component';

describe('BakkesInfoDialogComponent', () => {
  let component: BakkesInfoDialogComponent;
  let fixture: ComponentFixture<BakkesInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BakkesInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BakkesInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
