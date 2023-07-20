import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMapComponent } from './board.component';

describe('BoardMapComponent', () => {
  let component: BoardMapComponent;
  let fixture: ComponentFixture<BoardMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
