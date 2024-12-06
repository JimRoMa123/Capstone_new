import { TestBed } from '@angular/core/testing';

import { BodegaListService } from './bodega-list.service';

describe('BodegaListService', () => {
  let service: BodegaListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodegaListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
