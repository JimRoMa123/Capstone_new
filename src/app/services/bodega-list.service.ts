import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BodegaListService {
  private baseUrl = 'http://localhost:3000'; // Cambia esta URL según tu configuración

  constructor(private http: HttpClient) {}

  getBodegas(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/bodegas`).pipe(
      map((response) => response.data) // Asegúrate de que el backend devuelve `data`
    );
  }
}
