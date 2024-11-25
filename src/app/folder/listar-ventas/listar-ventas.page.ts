import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './listar-ventas.page.html',
  styleUrls: ['./listar-ventas.page.scss'],
})
export class ListarVentasPage implements OnInit {
  ventas: any[] = [];
  detalleVenta: any = null; // Detalle de la venta seleccionada
  isLoading: boolean = true;
  isDetalleModalOpen: boolean = false; // Estado del modal de detalle

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.isLoading = true;
    this.http.get('http://localhost:3000/ventas').subscribe(
      (response: any) => {
        this.ventas = response.data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar ventas:', error);
        this.isLoading = false;
      }
    );
  }

  abrirDetalleVenta(venta: any) {
    this.isDetalleModalOpen = true;

    // Cargar detalle de la venta
    this.http.get(`http://localhost:3000/detalle-venta/${venta.id}`).subscribe(
      (response: any) => {
        this.detalleVenta = {
          ...venta,
          productos: response.data, // Productos de la venta
        };
      },
      (error) => {
        console.error('Error al cargar el detalle de la venta:', error);
      }
    );
  }

  cerrarDetalleModal() {
    this.isDetalleModalOpen = false;
    this.detalleVenta = null; // Resetear el detalle
  }
}
