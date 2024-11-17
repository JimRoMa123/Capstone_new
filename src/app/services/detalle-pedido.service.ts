import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetallePedidoService {
  private apiUrl = 'http://localhost:3000'; // Cambia según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener el detalle de un pedido por pedidoId
  getDetallePedido(pedidoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/detalle-pedido/${pedidoId}`);
  }
}
