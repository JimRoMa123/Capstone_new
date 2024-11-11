import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Proovedores } from 'src/app/models/proovedores';
import { ProovedoresService } from 'src/app/services/proovedores.service';
import { ComunaService } from 'src/app/services/comuna.service';
import { ProveedorService } from '../../services/proveedor.service';
import { GiroService } from 'src/app/services/giro.service';
import { CategoriaService } from 'src/app/services/categoria.service';


@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
})
export class CrearProductoPage implements OnInit {

  constructor(
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

}
