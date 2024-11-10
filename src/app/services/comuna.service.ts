import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ComunaService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getComunas(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/table/comuna`).pipe(
      map(response => response.data) // Extrae el array de comunas desde `data`
    );
  }
}
