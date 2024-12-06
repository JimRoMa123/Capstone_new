import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarBodegasPage } from './listar-bodegas.page';

describe('ListarBodegasPage', () => {
  let component: ListarBodegasPage;
  let fixture: ComponentFixture<ListarBodegasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarBodegasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
