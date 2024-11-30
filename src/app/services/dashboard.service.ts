import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getVentasMes(): Observable<{ total_ventas: number; ventas_semanales: number[] }> {
    return this.http.get<{ total_ventas: number; ventas_semanales: number[] }>(`${this.apiUrl}/ventas-mes`);
  }

  getEstadoCompras(): Observable<{ estado: string; total: number }[]> {
    return this.http.get<{ estado: string; total: number }[]>(`${this.apiUrl}/estado-compras`);
  }
}
