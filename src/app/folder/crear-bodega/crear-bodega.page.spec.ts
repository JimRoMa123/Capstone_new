import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearBodegaPage } from './crear-bodega.page';

describe('CrearBodegaPage', () => {
  let component: CrearBodegaPage;
  let fixture: ComponentFixture<CrearBodegaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearBodegaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
