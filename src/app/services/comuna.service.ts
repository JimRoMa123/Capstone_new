import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComunaService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}



  getComunasPorProvincia(provinciaId: number): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/comunas/${provinciaId}`).pipe(
      map(response => response.data) 
    );
  }
}
