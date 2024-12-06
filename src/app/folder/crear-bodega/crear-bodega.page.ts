import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RegionService } from 'src/app/services/region.service';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { ComunaService } from 'src/app/services/comuna.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-bodega',
  templateUrl: './crear-bodega.page.html',
  styleUrls: ['./crear-bodega.page.scss'],
})
export class CrearBodegaPage implements OnInit {
  // Propiedades del formulario
  nombre: string = '';
  direccion: string = '';
  capacidad: number = 0;
  cantidadArt: number = 0;
  regionId: number | null = null;
  provinciaId: number | null = null;
  comunaId: number | null = null;

  // Propiedades de selección
  nombreRegion: string = '';
  nombreProvincia: string = '';
  nombreComuna: string = '';

  // Modales
  isModalOpenRegion: boolean = false;
  isModalOpenProvincia: boolean = false;
  isModalOpenComuna: boolean = false;

  // Listas de regiones, provincias, comunas
  regiones: any[] = [];
  provincias: any[] = [];
  comunas: any[] = [];

  // Listas filtradas para búsquedas
  regionesFiltradas: any[] = [];
  provinciasFiltradas: any[] = [];
  comunasFiltradas: any[] = [];

  // Búsquedas
  searchRegion: string = '';
  searchProvincia: string = '';
  searchComuna: string = '';

  constructor(
    private alertController: AlertController,
    private regionService: RegionService,
    private provinciaService: ProvinciaService,
    private comunaService: ComunaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarRegiones();
  }

  cargarRegiones() {
    this.regionService.getRegion().subscribe(
      (data) => {
        this.regiones = data;
        this.regionesFiltradas = [...this.regiones];
      },
      (error) => console.error('Error al cargar regiones:', error)
    );
  }

  cargarProvincias() {
    if (this.regionId) {
      this.provinciaService.getProvinciasPorRegion(this.regionId).subscribe(
        (data) => {
          this.provincias = data;
          this.provinciasFiltradas = [...this.provincias];
        },
        (error) => console.error('Error al cargar provincias:', error)
      );
    }
  }

  cargarComunas() {
    if (this.provinciaId) {
      this.comunaService.getComunasPorProvincia(this.provinciaId).subscribe(
        (data) => {
          this.comunas = data;
          this.comunasFiltradas = [...this.comunas];
        },
        (error) => console.error('Error al cargar comunas:', error)
      );
    }
  }

  // Métodos para búsqueda
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

  // Métodos de selección
  seleccionarRegion(region: any) {
    this.regionId = region.codigo_region;
    this.nombreRegion = region.nombre;
    this.cargarProvincias();

    // Limpiar selección dependiente
    this.provinciaId = null;
    this.nombreProvincia = '';
    this.comunasFiltradas = [];
    this.nombreComuna = '';
    this.cerrarModal();
  }

  seleccionarProvincia(provincia: any) {
    this.provinciaId = provincia.codigo_provincia;
    this.nombreProvincia = provincia.nombre;
    this.cargarComunas();

    // Limpiar selección dependiente
    this.comunaId = null;
    this.nombreComuna = '';
    this.cerrarModal();
  }

  seleccionarComuna(comuna: any) {
    this.comunaId = comuna.codigo_comuna;
    this.nombreComuna = comuna.nombre;
    this.cerrarModal();
  }

  // Métodos para abrir y cerrar modales
  abrirModalRegiones() {
    this.isModalOpenRegion = true;
  }

  abrirModalProvincias() {
    this.isModalOpenProvincia = true;
  }

  abrirModalComunas() {
    this.isModalOpenComuna = true;
  }

  cerrarModal() {
    this.isModalOpenRegion = false;
    this.isModalOpenProvincia = false;
    this.isModalOpenComuna = false;
  }

  // Método para crear bodega
  async createBodega() {
    if (!this.nombre || !this.direccion || !this.capacidad || !this.regionId || !this.provinciaId || !this.comunaId) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const bodegaData = {
      nombre: this.nombre,
      direccion: this.direccion,
      capacidad: this.capacidad,
      cantidad_art: 1,
      fecha_creacion: new Date().toISOString(),
      region_id: this.regionId,
      provincia_id: this.provinciaId,
      comuna_id: this.comunaId,
      user_id: 1, 
    };

    console.log(bodegaData)

    this.http.post('http://localhost:3000/add-bodega', bodegaData).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Bodega creada correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
        this.resetForm();
      },
      async (error) => {
        console.error('Error al crear bodega:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al crear la bodega.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  resetForm() {
    this.nombre = '';
    this.direccion = '';
    this.capacidad = 0;
    this.cantidadArt = 0;
    this.regionId = null;
    this.provinciaId = null;
    this.comunaId = null;
    this.nombreRegion = '';
    this.nombreProvincia = '';
    this.nombreComuna = '';
  }
}
