import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getProducto(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/table/producto`).pipe(
      map(response => response.data) 
    );
  }
}
