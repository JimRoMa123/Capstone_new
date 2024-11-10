import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/table/region`);
  }
}
