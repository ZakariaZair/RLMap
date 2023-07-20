import { TestBed } from '@angular/core/testing';

import { MapBoarderService } from './map-boarder.service';

describe('MapBoarderService', () => {
  let service: MapBoarderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapBoarderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
