import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProveedoresPage } from './listar-proveedores.page';

describe('ListarProveedoresPage', () => {
  let component: ListarProveedoresPage;
  let fixture: ComponentFixture<ListarProveedoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProveedoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
