import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './listar-ventas.page.html',
  styleUrls: ['./listar-ventas.page.scss'],
})
export class ListarVentasPage implements OnInit {
  ventas: any[] = [];
  ventasFiltradas: any[] = [];
  detalleVenta: any = null;
  isLoading: boolean = true;
  isDetalleModalOpen: boolean = false; 
  isCambiarEstadoModalOpen: boolean = false;
  nuevoEstadoVenta: string = 'pendiente';

  filtro: string = 'Completada'; // Estado seleccionado inicialmente
  searchTerm: string = ''; // Término de búsqueda por cliente

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.isLoading = true;
    this.http.get('http://localhost:3000/ventas').subscribe(
      (response: any) => {
        this.ventas = response.data;
        this.filtrarVentas();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar ventas:', error);
        this.isLoading = false;
      }
    );
  }

  filtrarVentas() {
    // Filtra primero por estado
    let filtradas = this.ventas.filter(venta => venta.estado === this.filtro);

    // Si hay término de búsqueda, filtra por nombre de cliente
    if (this.searchTerm.trim() !== '') {
      const termino = this.searchTerm.toLowerCase();
      filtradas = filtradas.filter(venta =>
        (venta.cliente_nombre && venta.cliente_nombre.toLowerCase().includes(termino))
        || (venta.cliente_apellido && venta.cliente_apellido.toLowerCase().includes(termino))
      );
    }

    this.ventasFiltradas = filtradas;
  }

  cambiarFiltro(event: any) {
    this.filtro = event.detail.value;
    this.filtrarVentas();
  }

  buscarCliente(event: any) {
    this.searchTerm = event.target.value || '';
    this.filtrarVentas();
  }

  abrirDetalleVenta(venta: any) {
    this.isDetalleModalOpen = true;
    this.http.get(`http://localhost:3000/detalle-venta/${venta.id}`).subscribe(
      (response: any) => {
        this.detalleVenta = {
          ...venta,
          productos: response.data,
        };
      },
      (error) => {
        console.error('Error al cargar el detalle de la venta:', error);
      }
    );
  }

  cerrarDetalleModal() {
    this.isDetalleModalOpen = false;
    this.detalleVenta = null;
  }

  abrirCambiarEstadoModal() {
    this.nuevoEstadoVenta = this.detalleVenta?.estado || 'pendiente';
    this.isCambiarEstadoModalOpen = true;
  }

  cerrarCambiarEstadoModal() {
    this.isCambiarEstadoModalOpen = false;
  }

  guardarNuevoEstado() {
    if (!this.detalleVenta || !this.detalleVenta.id) return;

    this.http.patch(`http://localhost:3000/ventas/${this.detalleVenta.id}`, { estado: this.nuevoEstadoVenta }).subscribe(
      (response: any) => {
        this.detalleVenta.estado = this.nuevoEstadoVenta;
        const ventaIndex = this.ventas.findIndex(v => v.id === this.detalleVenta.id);
        if (ventaIndex > -1) {
          this.ventas[ventaIndex].estado = this.nuevoEstadoVenta;
        }
        this.filtrarVentas();
        this.cerrarCambiarEstadoModal();
      },
      (error) => {
        console.error('Error al actualizar el estado de la venta:', error);
      }
    );
  }
}
