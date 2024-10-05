import { TestBed } from '@angular/core/testing';

import { OrdenDeCompraService } from './orden-de-compra.service';

describe('OrdenDeCompraService', () => {
  let service: OrdenDeCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenDeCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
