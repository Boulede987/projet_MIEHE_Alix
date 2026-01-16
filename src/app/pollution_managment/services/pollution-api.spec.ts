import { TestBed } from '@angular/core/testing';

import { PollutionAPI } from './pollution-api';

describe('PollutionAPI', () => {
  let service: PollutionAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollutionAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
