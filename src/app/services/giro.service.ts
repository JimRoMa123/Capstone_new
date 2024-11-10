import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GiroService {

  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getGiro(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/table/proveedor_giro`).pipe(
      map(response => response.data)
    );
  }
}
