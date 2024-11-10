import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getRegion(): Observable<any[]> { // O define un tipo específico para los datos
    return this.http.get<any>(`${this.apiUrl}/table/region`).pipe(
      map(response => response.data)
    );
  }
}
