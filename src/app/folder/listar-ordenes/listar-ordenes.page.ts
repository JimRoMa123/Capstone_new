import { Component, OnInit } from '@angular/core';
import { Proovedores } from 'src/app/models/proovedores';
import { ProovedoresService } from 'src/app/services/proovedores.service';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Platform } from '@ionic/angular';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra';
import { OrdendeCompraService } from 'src/app/services/orden-de-compra.service';



@Component({
  selector: 'app-listar-ordenes',
  templateUrl: './listar-ordenes.page.html',
  styleUrls: ['./listar-ordenes.page.scss'],
  
})
export class ListarOrdenesPage implements OnInit {
  ordenes: OrdenDeCompra[] = [];
  constructor(private ordenOrdendeCompraService: OrdendeCompraService,) { }

  ionViewWillEnter() {
    this.ordenes = this.ordenOrdendeCompraService.obtenerOrdendeCompra();
  }

  ngOnInit() {
  }

}
