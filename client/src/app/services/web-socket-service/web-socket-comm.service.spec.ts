import { TestBed } from '@angular/core/testing';

import { WebSocketCommService } from './web-socket-comm.service';

describe('WebSocketCommService', () => {
  let service: WebSocketCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
