import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BodegaService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  addBodega(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-bodega`, data);
  }
}
