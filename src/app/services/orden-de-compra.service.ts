import { Injectable } from '@angular/core';
import { OrdenDeCompra } from '../models/orden-de-compra';

@Injectable({
  providedIn: 'root'
})
export class OrdendeCompraService {
  private Ordendecompra: OrdenDeCompra[] = [];
  private ultimoId: number = 0;

  agregarOrdenDeCompra(Ordendecompra: OrdenDeCompra): void {
    this.Ordendecompra.push(Ordendecompra);
  }

  obtenerOrdendeCompra(): OrdenDeCompra[] {
    return this.Ordendecompra;
  }

  generarIdUnico(): number {
    return ++this.ultimoId;
  }
  
  
}