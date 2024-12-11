import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ComunaService } from 'src/app/services/comuna.service';
import { RegionService } from 'src/app/services/region.service';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { GiroService } from 'src/app/services/giro.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage implements OnInit {
  // Propiedades del formulario
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  comunaId: number = 0;
  provinciaId: number = 0;
  regionId: number = 0;
  giroId: number = 0;
  giroNombre: string = '';
  logo: string = '';
  rut: string = '';
  latitud: string = '';
  longitud: string = '';

  // Estados de los modales
  isModalOpen: boolean = false;
  isModalOpenRegion: boolean = false;
  isModalOpenProvincia: boolean = false;
  isModalOpenGiro: boolean = false;

  // Datos cargados
  regiones: any[] = [];
  provincias: any[] = [];
  comunas: any[] = [];
  giros: any[] = [];

  // Datos filtrados
  regionesFiltradas: any[] = [];
  provinciasFiltradas: any[] = [];
  comunasFiltradas: any[] = [];
  girosFiltrados: any[] = [];

  // Búsqueda
  searchRegion: string = '';
  searchProvincia: string = '';
  searchComuna: string = '';
  searchGiro: string = '';

  // Nombres seleccionados
  nombreRegion: string = '';
  nombreProvincia: string = '';
  nombreComuna: string = '';
  nombreGiro: string = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private comunaService: ComunaService,
    private regionService: RegionService,
    private provinciaService: ProvinciaService,
    private giroService: GiroService
  ) {}

  ngOnInit() {
    this.cargarRegiones();
    this.cargarGiros();
  }

  cargarRegiones() {
    this.regionService.getRegion().subscribe((data) => {
      this.regiones = data;
      this.regionesFiltradas = [...data];
    });
  }

  cargarGiros() {
    this.giroService.getGiro().subscribe((data) => {
      this.giros = data;
      this.girosFiltrados = [...data];
    });
  }

  cargarProvincias(regionId: number) {
    this.provinciaService.getProvinciasPorRegion(regionId).subscribe((data) => {
      this.provincias = data;
      this.provinciasFiltradas = [...data];
    });
  }

  cargarComunas(provinciaId: number) {
    this.comunaService.getComunasPorProvincia(provinciaId).subscribe((data) => {
      this.comunas = data;
      this.comunasFiltradas = [...data];
    });
  }

  // Filtrar elementos
  filtrarRegiones() {
    this.regionesFiltradas = this.regiones.filter((region) =>
      region.nombre.toLowerCase().includes(this.searchRegion.toLowerCase())
    );
  }

  filtrarProvincias() {
    this.provinciasFiltradas = this.provincias.filter((provincia) =>
      provincia.nombre.toLowerCase().includes(this.searchProvincia.toLowerCase())
    );
  }

  filtrarComunas() {
    this.comunasFiltradas = this.comunas.filter((comuna) =>
      comuna.nombre.toLowerCase().includes(this.searchComuna.toLowerCase())
    );
  }

  filtrarGiros() {
    this.girosFiltrados = this.giros.filter((giro) =>
      giro.nombre.toLowerCase().includes(this.searchGiro.toLowerCase())
    );
  }

  // Seleccionar elementos
  seleccionarRegion(region: any) {
    this.regionId = region.codigo_region;
    this.nombreRegion = region.nombre;
    this.cargarProvincias(region.codigo_region);
    this.nombreProvincia = '';
    this.nombreComuna = '';
    this.cerrarModal();
  }

  seleccionarProvincia(provincia: any) {
    this.provinciaId = provincia.codigo_provincia;
    this.nombreProvincia = provincia.nombre;
    this.cargarComunas(provincia.codigo_provincia);
    this.nombreComuna = '';
    this.cerrarModal();
  }

  seleccionarComuna(comuna: any) {
    this.comunaId = comuna.codigo_comuna;
    this.nombreComuna = comuna.nombre;
    this.cerrarModal();
  }

  seleccionarGiro(giro: any) {
    this.giroId = giro.id;
    this.nombreGiro = giro.nombre;
    this.cerrarModal();
  }

  // Abrir/Cerrar modales
  abrirModalRegiones() {
    this.isModalOpenRegion = true;
  }

  abrirModalProvincias() {
    if (this.regionId) {
      this.isModalOpenProvincia = true;
    }
  }

  abrirModalComunas() {
    if (this.provinciaId) {
      this.isModalOpen = true;
    }
  }

  abrirModalGiro() {
    this.isModalOpenGiro = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.isModalOpenRegion = false;
    this.isModalOpenProvincia = false;
    this.isModalOpenGiro = false;
  }

  obtenerUbicacion() {
    // Construimos la dirección completa a geocodificar
    // Incluimos direccion, comuna, provincia y región
    const fullAddress = `${this.direccion}, ${this.nombreComuna}, ${this.nombreProvincia}, ${this.nombreRegion}`;
    const query = encodeURIComponent(fullAddress);

    const accessToken = 'pk.eyJ1IjoiamFpcm9kcmlndWV6bSIsImEiOiJjbTQwanp0ZTQwNnJxMm1wcjd5bzhxZnduIn0.iVDBeD4K6obl8DxvGVZQcg';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}`;

    this.http.get(url).subscribe((response: any) => {
      if (response.features && response.features.length > 0) {
        // El centro (center) es un arreglo [longitud, latitud]
        const [lng, lat] = response.features[0].center;
        this.latitud = lat.toString();
        this.longitud = lng.toString();

        this.alertController.create({
          header: 'Ubicación Obtenida',
          message: `Latitud: ${this.latitud}, Longitud: ${this.longitud}`,
          buttons: ['OK']
        }).then(alert => alert.present());
      } else {
        this.alertController.create({
          header: 'Error',
          message: 'No se pudo obtener coordenadas para esa dirección.',
          buttons: ['OK']
        }).then(alert => alert.present());
      }
    }, error => {
      console.error('Error en la geocodificación directa:', error);
      this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al obtener las coordenadas.',
        buttons: ['OK']
      }).then(alert => alert.present());
    });
  }

  // Agregar proveedor
  addProveedor() {
    const today = new Date();
    const proveedorData = {
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      comuna_id: this.comunaId,
      provincia_id: this.provinciaId,
      region_id: this.regionId,
      giro_id: this.giroId,
      logo: this.logo,
      rut: this.rut,
      latitud: this.latitud,
      longitud: this.longitud,
      fecha_creacion: today,
      fecha_actualizacion: today,
    };

    this.http.post('http://localhost:3000/add-proveedor', proveedorData).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Proveedor agregado correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
        this.limpiarFormulario();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al agregar el proveedor.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  limpiarFormulario() {
    this.nombre = '';
    this.direccion = '';
    this.telefono = '';
    this.email = '';
    this.regionId = 0;
    this.provinciaId = 0;
    this.comunaId = 0;
    this.giroId = 0;
    this.nombreRegion = '';
    this.nombreProvincia = '';
    this.nombreComuna = '';
    this.nombreGiro = '';
    this.logo = '';
    this.rut = '';
    this.latitud = '';
    this.longitud = '';
  }

  // ---------------------------
  // Función para obtener lat/long desde dirección
  // ---------------------------

}
