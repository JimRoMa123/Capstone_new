import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProveedorUbicacionPage } from './proveedor-ubicacion.page';

describe('ProveedorUbicacionPage', () => {
  let component: ProveedorUbicacionPage;
  let fixture: ComponentFixture<ProveedorUbicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorUbicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
