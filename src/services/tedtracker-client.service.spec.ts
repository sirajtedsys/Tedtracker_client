import { TestBed } from '@angular/core/testing';

import { TedtrackerClientService } from './tedtracker-client.service';

describe('TedtrackerClientService', () => {
  let service: TedtrackerClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TedtrackerClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
