import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarOrdenesPage } from './listar-ordenes.page';

describe('ListarOrdenesPage', () => {
  let component: ListarOrdenesPage;
  let fixture: ComponentFixture<ListarOrdenesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarOrdenesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
