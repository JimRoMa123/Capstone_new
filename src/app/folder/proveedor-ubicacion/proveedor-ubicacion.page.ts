import { Component, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-proveedor-ubicacion',
  templateUrl: './proveedor-ubicacion.page.html',
  styleUrls: ['./proveedor-ubicacion.page.scss'],
})
export class ProveedorUbicacionPage{
  map!: mapboxgl.Map;

  constructor() {}

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    (mapboxgl as any).accessToken =
      'pk.eyJ1IjoiamFpcm9kcmlndWV6bSIsImEiOiJjbTQwanp0ZTQwNnJxMm1wcjd5bzhxZnduIn0.iVDBeD4K6obl8DxvGVZQcg';

    this.map = new mapboxgl.Map({
      container: 'map', // El id del contenedor HTML
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
      center: [-70.6693, -33.4489], // Coordenadas para centrar en Santiago de Chile
      zoom: 12, // Nivel de zoom inicial
    });

    // Opcional: Agregar controles de navegación
    this.map.addControl(new mapboxgl.NavigationControl());
  }
  
  }



