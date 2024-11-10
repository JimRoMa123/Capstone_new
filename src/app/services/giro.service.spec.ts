import { TestBed } from '@angular/core/testing';

import { GiroService } from './giro.service';

describe('GiroService', () => {
  let service: GiroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
