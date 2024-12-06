import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ProveedorService } from '../../services/proveedor.service';
import { Platform, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-listar-proveedores',
  templateUrl: './listar-proveedores.page.html',
  styleUrls: ['./listar-proveedores.page.scss'],
  providers: [EmailComposer]
})
export class ListarProveedoresPage implements OnInit {
  proveedores: any[] = [];
  productos: any[] = [];
  productosSeleccionados: any[] = [];
  mensajeCorreo: string = '';
  isModalOpen = false;
  isProductosModalOpen = false;
  isLoading: boolean = true;
  fecha_pedido: Date = new Date();
  total: number = 0;
  proveedorSeleccionado: any = null;
  isMapaModalOpen = false;
  latitud: number = 0;
  longitud: number = 0;

  constructor(
    private proveedorService: ProveedorService,
    private platform: Platform,
    private emailComposer: EmailComposer,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.isLoading = true;
    this.proveedorService.getProveedores().subscribe(
      response => {
        this.proveedores = response.data.map((proveedor: any) => ({
          ...proveedor,
          latitud: parseFloat(proveedor.latitud), // Asegúrate de convertirlo a número
          longitud: parseFloat(proveedor.longitud),
        }));
        this.isLoading = false;
      },
      error => {
        console.error('Error al obtener proveedores:', error);
        this.isLoading = false;
      }
    );
  }

  isEdicionModalOpen = false;

abrirModalEdicion(proveedor: any) {
  this.proveedorSeleccionado = { ...proveedor }; // Crear una copia del proveedor seleccionado
  this.isEdicionModalOpen = true;
}

cerrarModalEdicion() {
  this.isEdicionModalOpen = false;
}

guardarCambios() {
  const proveedorActualizado = this.proveedorSeleccionado;
  this.http.put(`http://localhost:3000/update-proveedor/${proveedorActualizado.id}`, proveedorActualizado)
    .subscribe(
      async (response: any) => {
        // Actualiza la lista de proveedores
        const index = this.proveedores.findIndex(p => p.id === proveedorActualizado.id);
        if (index !== -1) {
          this.proveedores[index] = proveedorActualizado;
        }

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Proveedor actualizado correctamente.',
          buttons: ['OK']
        });
        await alert.present();

        this.cerrarModalEdicion();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al actualizar el proveedor.',
          buttons: ['OK']
        });
        await alert.present();
        console.error('Error al actualizar proveedor:', error);
      }
    );
}

  
  mostrarMapa(latitud: number, longitud: number) {
    this.latitud = latitud;
    this.longitud = longitud;
    this.isMapaModalOpen = true;
  
    setTimeout(() => {
      this.cargarMapa(this.latitud,this.longitud);
    }, 100); 
  }
  cerrarMapa() {
    this.isMapaModalOpen = false;
  }
  cargarMapa(latitud: number, longitud: number) {
   
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiamFpcm9kcmlndWV6bSIsImEiOiJjbTQwanp0ZTQwNnJxMm1wcjd5bzhxZnduIn0.iVDBeD4K6obl8DxvGVZQcg';
  
    const map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitud, latitud], 
      zoom: 12, 
    });
  
    new mapboxgl.Marker() // Agregar un marcador en las coordenadas
      .setLngLat([longitud, latitud])
      .addTo(map);
  }
  
  
  seleccionarProveedor(proveedor: any) {
    this.proveedorSeleccionado = proveedor;
    this.cargarProductosPorProveedor(proveedor.id);
    this.isModalOpen = true;
  }

  cargarProductosPorProveedor(proveedorId: string) {
    this.http.get(`http://localhost:3000/productos-por-proveedor/${proveedorId}`).subscribe(
      (response: any) => {
        this.productos = response.data.map((producto: any) => ({
          ...producto,
          cantidadSeleccionada: 0,
          seleccionado: false
        }));
        this.actualizarSeleccionados(); // Actualizar productos seleccionados al cargar
      },
      (error) => {
        console.error('Error al obtener productos del proveedor:', error);
        this.productos = [];
      }
    );
  }

  abrirModalProductos() {
    this.isProductosModalOpen = true;
  }

  cerrarModalProductos() {
    this.isProductosModalOpen = false;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.proveedorSeleccionado = null;
  }

  actualizarSeleccionados() {
    this.productosSeleccionados = this.productos.filter(producto => producto.seleccionado && producto.cantidadSeleccionada > 0);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.productosSeleccionados.reduce(
      (acc, producto) => acc + producto.precio_compra * producto.cantidadSeleccionada, 
      0
    );
  }

  

  enviarPedido() {
    const productosSeleccionados = this.productosSeleccionados.map(producto => ({
      producto_id: producto.id,
      cantidad: producto.cantidadSeleccionada,
      precio_unitario: producto.precio_compra
    }));
  
    if (productosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un producto.');
      return;
    }
  
    const pedido = {
      fecha_pedido: new Date(),
      total: this.total,
      estado: 'en espera',
      proveedor_id: this.proveedorSeleccionado.id,
      productos: productosSeleccionados
    };
  

    this.http.post('http://localhost:3000/add-proveedor_pedido', pedido).subscribe(
      async (response: any) => {

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Pedido creado correctamente.',
          buttons: ['OK']
        });
        await alert.present();
  

        this.enviarCorreoProveedor();
  

        this.cerrarModal();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al crear el pedido.',
          buttons: ['OK']
        });
        await alert.present();
        console.error('Error al crear pedido:', error);
      }
    );
  }
  

  enviarCorreoProveedor() {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      // Construir el cuerpo del correo
      let cuerpoCorreo = `<p>Estimado/a ${this.proveedorSeleccionado.nombre},</p>`;
      cuerpoCorreo += `<p>Se ha generado un nuevo pedido con los siguientes detalles:</p>`;
      cuerpoCorreo += `<ul>`;
      this.productosSeleccionados.forEach((producto: any) => {
        cuerpoCorreo += `<li>${producto.cantidadSeleccionada} x ${producto.nombre} - $${producto.precio_compra} c/u</li>`;
      });
      cuerpoCorreo += `</ul>`;
      cuerpoCorreo += `<p>Total: $${this.total}</p>`;
      cuerpoCorreo += `<p>Gracias por su atención.</p>`;
  
      // Configuración del correo
      const email = {
        to: this.proveedorSeleccionado.email,
        subject: 'Nuevo Pedido - Orden de Compra',
        body: cuerpoCorreo,
        isHtml: true
      };
  
      // Enviar el correo
      this.emailComposer.open(email);
    } else {
      alert('Funcionalidad de correo no disponible en el navegador.');
    }
  }
  
  
  
}
