import { TestBed } from '@angular/core/testing';

import { ReplayFetcherService } from './replay-fetcher.service';

describe('ReplayLoaderService', () => {
  let service: ReplayFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplayFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
