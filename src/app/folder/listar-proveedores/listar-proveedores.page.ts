import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra';
import { ProveedorService } from '../../services/proveedor.service';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-listar-proveedores',
  templateUrl: './listar-proveedores.page.html',
  styleUrls: ['./listar-proveedores.page.scss'],
  providers: [EmailComposer]
})
export class ListarProveedoresPage implements OnInit {
  proveedores: any[] = [];
  mensajeCorreo: string = '';  
  isModalOpen = false;
  isModalEditOpen = false;
  isLoading: boolean = true;
  ngOnInit() {
    this.cargarProveedores();
  }

  constructor(private proveedorService: ProveedorService, private platform: Platform, private emailComposer: EmailComposer,) {}

  cargarProveedores() {
    this.isLoading = true;
    this.proveedorService.getProveedores().subscribe(
      response => {
        this.proveedores = response.data;
        this.isLoading = false;  // Finaliza la carga
      },
      error => {
        console.error('Error al obtener clientes:', error);
        this.isLoading = false;  // Finaliza la carga incluso si hay un error
      }
    );
  }
  
 /* enviarCorreo(proveedores: ProveedorServices | null) {
    if (!proveedores) {
      console.log('No hay proveedor seleccionado');
      return;
    }

    const id = this.OrdendeCompraService.generarIdUnico();
    const nuevaOrden = new OrdenDeCompra(id, proovedor, this.mensajeCorreo,'En espera' , this.cantidad, this.fechaEntrega);
    this.OrdendeCompraService.agregarOrdenDeCompra(nuevaOrden);

    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      let email = {
        to: proovedor.email,
        subject: 'Orden de Compra',
        body: `Buenos días, ${proovedor.nombre}. Nuestro cliente requiere los siguientes productos: ${this.mensajeCorreo}`,
        isHtml: true
      };
      this.emailComposer.open(email);
      this.mensajeCorreo = '';
    } else {
      alert('Funcionalidad de correo no disponible en el navegador.');
    }
  }
  

*/


enviarCorreo(proveedor: any) {
  if (!proveedor) {
    console.log('No hay proveedor seleccionado');
    return;
  }
  console.log(proveedor);
  if (this.platform.is('cordova') || this.platform.is('capacitor')) {
    let email = {
      to: proveedor.email,
      subject: 'Orden de Compra',
      body: `Buenos días, ${proveedor.nombre}. Nuestro cliente requiere los siguientes productos: ${this.mensajeCorreo}`,
      isHtml: true
    };
    this.emailComposer.open(email);
    this.mensajeCorreo = '';
  } else {
    alert('Funcionalidad de correo no disponible en el navegador.');
  }
}
}
