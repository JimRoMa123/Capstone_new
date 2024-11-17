import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { DetallePedidoService } from '../../services/detalle-pedido.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-listar-ordenes',
  templateUrl: './listar-ordenes.page.html',
  styleUrls: ['./listar-ordenes.page.scss'],
})
export class ListarOrdenesPage implements OnInit {
  ordenes: any[] = [];
  detallePedido: any[] = [];
  isModalOpen = false;

  constructor(
    private pedidoService: PedidoService,
    private detallePedidoService: DetallePedidoService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidoService.getPedidos().subscribe(
      (response) => {
        this.ordenes = response.data;
      },
      (error) => {
        console.error('Error al cargar pedidos:', error);
      }
    );
  }

  abrirDetallePedido(pedidoId: number) {
    this.detallePedidoService.getDetallePedido(pedidoId).subscribe(
      (response) => {
        this.detallePedido = response.data;
        this.isModalOpen = true;
      },
      (error) => {
        console.error('Error al cargar detalle del pedido:', error);
      }
    );
  }

  cerrarModal() {
    this.isModalOpen = false;
  }
}
