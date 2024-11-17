import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000'; // Cambia según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener todos los pedidos
  getPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos`);
  }

  // Obtener un pedido por ID
  getPedidoById(pedidoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/${pedidoId}`);
  }
}
