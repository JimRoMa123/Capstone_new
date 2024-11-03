import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'http://localhost:3000'; // Cambia esto si estás en producción

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/table/cliente`);
  }
}
