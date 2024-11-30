import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Proovedores } from 'src/app/models/proovedores';
import { ProovedoresService } from 'src/app/services/proovedores.service';
import { ComunaService } from 'src/app/services/comuna.service';
import { RegionService } from 'src/app/services/region.service';
import { GiroService } from 'src/app/services/giro.service';



@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage implements OnInit {
  // Propiedades de los campos del formulario
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  comunaId: number = 0; 
  comunaSeleccionada: any;
  regionId: number = 0;
  giroId: number = 0;
  giroNombre: string= '';
  logo: string = '';
  rut: string = '';
  latitud: string = '';
  longitud: string = '';


  isModalOpen: boolean = false;
  isModalOpenRegion: boolean = false;
  isModalOpenGiro: boolean = false;

  regiones: any[] = [];
  comunas: any[] = [];
  giros: any[]=[]


  comunasFiltradas: any[] = [];
  searchComuna: string = '';
  nombreComuna: string = '';

  regionesFiltradas: any[] = [];
  searchRegion: string = '';
  nombreRegion: string = '';


  girosFiltrados: any[] = [];
  searchGiro: string = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private comunaService: ComunaService,
    private regionService: RegionService,
    private giroService: GiroService,
  ) {}

  ngOnInit() {
    this.cargarComunas(); 
    this.cargarRegiones(); 
    this.cargarGiro(); 
  }

  cargarComunas() {
    this.comunaService.getComunas().subscribe((data) => {
      this.comunas = data;
      this.comunasFiltradas = [...data]; 
    });
  }

  cargarRegiones() {
    this.regionService.getRegion().subscribe((data) => {
      this.regiones = data;
      this.regionesFiltradas = [...data];
    });
  }

  cargarGiro() {
    this.giroService.getGiro().subscribe((data) => {
      this.giros = data;
      this.girosFiltrados = [...data];
    });
  }

  // Filtrado de comunas
  filtrarComunas() {
    this.comunasFiltradas = this.comunas.filter((comuna) =>
      comuna.nombre.toLowerCase().includes(this.searchComuna.toLowerCase())
    );
  }
  

  // Filtrado de regiones
  filtrarRegiones() {
    this.regionesFiltradas = this.regiones.filter((region) =>
      region.nombre.toLowerCase().includes(this.searchRegion.toLowerCase())
    );
  }

  // Filtrado de giros
  filtrarGiros() {
    this.girosFiltrados = this.giros.filter((giro) =>
      giro.nombre.toLowerCase().includes(this.searchGiro.toLowerCase())
    );
  }

  // Métodos para abrir y cerrar las modales
  abrirModalComunas() {
    this.isModalOpen = true;
  }

  abrirModalGiro() {
    this.isModalOpenGiro = true;
  }

  abrirModalRegiones() {
    this.isModalOpenRegion = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.isModalOpenRegion = false;
    this.isModalOpenGiro = false;
  }

  seleccionarComuna(comuna: any) {
    console.log("Comuna seleccionada:", comuna);
    this.comunaId = comuna.codigo_comuna;
    this.cerrarModal();
    this.nombreComuna = comuna.nombre;
  }

  seleccionarRegion(region: any) {
    console.log("Region seleccionada:", region);
    this.regionId = region.codigo_region;
    this.cerrarModal();
    this.nombreRegion = region.nombre
  }

  seleccionarGiro(giro: any) {
    console.log("giro seleccionada:", giro);
    this.giroId = giro.id;
    this.giroNombre = giro.nombre
    this.cerrarModal();
    console.log(this.giroId)
  }

  // Método para agregar proveedor
  addProveedor() {
    const today = new Date();
    const proveedorData = {
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      fecha_creacion: today,
      fecha_actualizacion: today,
      comuna_id: this.comunaId,
      region_id: this.regionId,
      giro_id: this.giroId,
      logo: this.logo,
      rut: this.rut,
      latitud: this.latitud, // Nueva propiedad
      longitud: this.longitud // Nueva propiedad
    };
  
    this.http.post('http://localhost:3000/add-proveedor', proveedorData).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Proveedor agregado correctamente.',
          buttons: ['OK']
        });
        this.nombre = '';
        this.direccion = '';
        this.telefono = '';
        this.email = '';
        this.comunaId = 0; 
        this.comunaSeleccionada = undefined;
        this.regionId = 0;
        this.giroId = 0;
        this.giroNombre = '';
        this.logo = '';
        this.rut = '';
        this.latitud = ''; // Reiniciar latitud
        this.longitud = ''; // Reiniciar longitud
        await alert.present();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al agregar el proveedor.',
          buttons: ['OK']
        });
        await alert.present();
        console.error('Error al agregar proveedor:', error);
      }
    );
  }
  
}
