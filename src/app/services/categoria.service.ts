import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getCategoria(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/table/categoria`).pipe(
      map(response => response.data) 
    );
  }
}
