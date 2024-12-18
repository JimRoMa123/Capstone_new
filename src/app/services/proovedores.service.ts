import { Injectable } from '@angular/core';
import { Proovedores } from '../models/proovedores';

@Injectable({
  providedIn: 'root',
})
export class ProovedoresService {
  private proovedores: Proovedores[] = [];
  private ultimoId: number = 0;

  agregarProovedor(proovedor: Proovedores): void {
    this.proovedores.push(proovedor);
  }

  obtenerProovedores(): Proovedores[] {
    return this.proovedores;
  }

  generarIdUnico(): number {
    return ++this.ultimoId;
  }

  editarProovedor(id: number, datosActualizados: Proovedores): boolean {
    const index = this.proovedores.findIndex(p => p.id === id);
    if (index !== -1) {
      this.proovedores[index] = { ...this.proovedores[index], ...datosActualizados };
      return true;
    }
    return false;
  }
}
