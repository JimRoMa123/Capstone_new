import { Component, OnInit } from '@angular/core';
import { Proovedores } from 'src/app/models/proovedores';
import { ProovedoresService } from 'src/app/services/proovedores.service';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Platform } from '@ionic/angular';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra';
import { OrdendeCompraService } from 'src/app/services/orden-de-compra.service';

@Component({
  selector: 'app-listar-proveedores',
  templateUrl: './listar-proveedores.page.html',
  styleUrls: ['./listar-proveedores.page.scss'],
  providers: [EmailComposer]
})
export class ListarProveedoresPage implements OnInit {
  mensajeCorreo: string = '';  
  proovedores: Proovedores[] = [];
  proovedorSeleccionado: Proovedores | null = null;
  fechaEntrega: string = ''; // Cambiar a string
  cantidad: string = '0';  
  editarProovedor: Proovedores = new Proovedores(0, '', '', '', '', '', ''); 

  isModalOpen = false;
  isModalEditOpen = false;

  constructor(
    private proovedoresService: ProovedoresService,
    private emailComposer: EmailComposer,
    private OrdendeCompraService: OrdendeCompraService,
    private platform: Platform,
  ) {
    const today = new Date();
    
    this.fechaEntrega = today.toISOString().substring(0, 10);
  }

  ionViewWillEnter() {
    this.proovedores = this.proovedoresService.obtenerProovedores();
  }

  setOpenModalOrden(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  setOpenModalEdit(isOpen: boolean) {
    this.isModalEditOpen = isOpen;
    console.log('Modal Edit Open State:', this.isModalEditOpen);
    
    if (!isOpen) {
      this.editarProovedor = new Proovedores(0, '', '', '', '', '', '');
    }
  }
  
  onGuardarCambios() {
    this.guardarCambios();
    this.setOpenModalEdit(false); // Cerrar el modal después de guardar
  }
  

  seleccionarProovedor(proveedor: Proovedores) {
    this.proovedorSeleccionado = proveedor;
    this.editarProovedor = { ...proveedor };
  }

  guardarCambios() {
    if (this.proovedorSeleccionado) {
      console.log('Proveedor seleccionado para guardar:', this.proovedorSeleccionado);
      
      const proveedorActualizado = new Proovedores(
        this.proovedorSeleccionado.id,
        this.editarProovedor.nombre || '',
        this.editarProovedor.direccion || '',
        this.editarProovedor.telefono || '',
        this.editarProovedor.email || '',
        this.editarProovedor.alias || '',
        this.editarProovedor.pago || ''
      );
  
      this.proovedoresService.editarProovedor(this.proovedorSeleccionado.id, proveedorActualizado);
      console.log('Proveedor actualizado:', proveedorActualizado);
    } else {
      console.error('No se ha seleccionado un proveedor para editar.');
    }
  }
  

  
  


  enviarCorreo(proovedor: Proovedores | null) {
    if (!proovedor) {
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
  

  ngOnInit() {}

}
