import { TestBed } from '@angular/core/testing';

import { ReplayLoaderService } from './replay-loader.service';

describe('ReplayLoaderService', () => {
  let service: ReplayLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplayLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
