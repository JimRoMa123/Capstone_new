import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.page.html',
  styleUrls: ['./listar-clientes.page.scss'],
})
export class ListarClientesPage implements OnInit {
  clientes: any[] = [];
  isLoading: boolean = true;  // Variable de carga

  constructor(private clientesService: ClientesService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.isLoading = true;
    this.clientesService.getClientes().subscribe(
      response => {
        this.clientes = response.data;
        this.isLoading = false;  // Finaliza la carga
      },
      error => {
        console.error('Error al obtener clientes:', error);
        this.isLoading = false;  // Finaliza la carga incluso si hay un error
      }
    );
  }
}
