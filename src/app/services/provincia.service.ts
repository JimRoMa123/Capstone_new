import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}



  getProvinciasPorRegion(regionId: number): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/provincias/${regionId}`).pipe(
      map(response => response.data) 
    );
  }
}
