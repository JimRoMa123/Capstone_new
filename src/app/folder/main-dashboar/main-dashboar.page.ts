import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-dashboar',
  templateUrl: './main-dashboar.page.html',
  styleUrls: ['./main-dashboar.page.scss'],
})
export class MainDashboardPage implements OnInit {
  ventasMes: number = 0;
  ventasSemanales: number[] = [];
  estadoCompras: { estado: string; total: number }[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;

    // Obtener las ventas del mes
    this.http.get<{ total_ventas: number; ventas_semanales: number[] }>('http://localhost:3000/ventas-mes').subscribe(
      (response) => {
        this.ventasMes = response.total_ventas;
        this.ventasSemanales = response.ventas_semanales;
      },
      (error) => {
        console.error('Error al obtener ventas del mes:', error);
      }
    );

    // Obtener el estado de las compras
    this.http.get<{ estado: string; total: number }[]>('http://localhost:3000/estado-compras').subscribe(
      (response) => {
        this.estadoCompras = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener estado de las compras:', error);
        this.isLoading = false;
      }
    );
  }
}
