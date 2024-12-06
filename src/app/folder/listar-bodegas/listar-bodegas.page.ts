import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-listar-bodegas',
  templateUrl: './listar-bodegas.page.html',
  styleUrls: ['./listar-bodegas.page.scss'],
})
export class ListarBodegasPage implements OnInit {
  bodegas: any[] = [];
  productos: any[] = [];
  isModalOpen = false;
  bodegaSeleccionada: any = null;

  constructor(private http: HttpClient, private alertController: AlertController) {}

  ngOnInit() {
    this.cargarBodegas();
  }

  // Cargar bodegas desde el backend
  cargarBodegas() {
    this.http.get('http://localhost:3000/bodegas').subscribe(
      (response: any) => {
        this.bodegas = response.data;
      },
      (error) => {
        console.error('Error al cargar bodegas:', error);
      }
    );
  }

  // Abrir modal con productos de una bodega específica
  abrirModalProductos(bodega: any) {
    this.bodegaSeleccionada = bodega;

    this.http.get(`http://localhost:3000/productos/bodega/${bodega.id}`).subscribe(
      (response: any) => {
        this.productos = response.data;
        this.isModalOpen = true;
      },
      (error) => {
        console.error('Error al cargar productos de la bodega:', error);
        this.productos = []; // Limpiar productos si hay un error
      }
    );
  }

  // Cerrar modal
  cerrarModal() {
    this.isModalOpen = false;
    this.bodegaSeleccionada = null;
    this.productos = [];
  }
}
