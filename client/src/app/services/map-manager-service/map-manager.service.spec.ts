import { TestBed } from '@angular/core/testing';

import { MapManagerService } from './map-manager.service';

describe('MapBoarderService', () => {
  let service: MapManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
