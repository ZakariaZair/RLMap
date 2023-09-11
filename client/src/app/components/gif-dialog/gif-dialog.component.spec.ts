import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GifDialogComponent } from './gif-dialog.component';

describe('GifDialogComponent', () => {
  let component: GifDialogComponent;
  let fixture: ComponentFixture<GifDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GifDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GifDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
