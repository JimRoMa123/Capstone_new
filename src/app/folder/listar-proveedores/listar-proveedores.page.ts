import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra';
import { ProveedorService } from '../../services/proveedor.service';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
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
  fecha_pedido: Date = new Date();
  total: number = 0;
  estado: string = '';
  proveedor_id: string = '';
  nombreProveedor:string = '';
  proveedorSeleccionado: any = null;

  ngOnInit() {
    this.cargarProveedores();
  }

  constructor(
    private proveedorService: ProveedorService,
    private platform: Platform, 
    private emailComposer: EmailComposer,
    private http: HttpClient,
    private alertController: AlertController) {}


    setOpen(isOpen: boolean) {
      this.isModalOpen = isOpen;
    }

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
seleccionarProveedor(proveedor: any) {
  this.proveedorSeleccionado = proveedor;
  this.isModalOpen = true;
}

// Cerrar modal
setOpenModalOrden(isOpen: boolean) {
  this.isModalOpen = isOpen;
  if (!isOpen) {
    this.proveedorSeleccionado = null;
  }
}

enviarCorreo(proveedor: any) {
  if (!proveedor) {
    console.log('No hay proveedor seleccionado');
    return;
  }
  const pedidoProveedor ={
    fecha_pedido: this.fecha_pedido,
    total: this.total,
    estado: 'en espera',
    proveedor_id: proveedor.id,
    nombreProveedor: proveedor.nombre,
    pedido: this.mensajeCorreo
  }

  console.log(pedidoProveedor)
  this.http.post('http://localhost:3000/add-proveedor_pedido', pedidoProveedor).subscribe(
    async (response: any) => {
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'pedido agregado correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    },
    async (error) => {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al agregar el pedido.',
        buttons: ['OK']
      });
      await alert.present();
      console.error('Error al agregar pedido:', error);
    }
  );

  if (this.platform.is('cordova') || this.platform.is('capacitor')) {
    let email = {
      to: proveedor.email,
      subject: 'Orden de Compra',
      body: `Buenos días, ${proveedor.nombre}. Nuestro cliente requiere los siguientes productos: ${this.mensajeCorreo}, en la cantidad de ${this.total}`,
      isHtml: true
    };
    this.emailComposer.open(email);
    this.mensajeCorreo = '';
  } else {
    alert('Funcionalidad de correo no disponible en el navegador.');
  }

this.setOpen(false);
}
}
