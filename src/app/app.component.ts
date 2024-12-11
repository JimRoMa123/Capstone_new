import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public dashboardPage = { title: 'Dashboard', url: '/folder/dashboard', icon: 'analytics' };

  public productPages = [
    { title: 'Crear Producto', url: '/folder/crear-producto', icon: 'add' },
    { title: 'Crear Categoría', url: '/folder/crear-categoria', icon: 'grid' },
    { title: 'Listar Órdenes de Compra', url: '/folder/listar-ordenes', icon: 'cart' },


  ];

  public providerPages = [
    { title: 'Crear Proveedor', url: '/folder/proveedores', icon: 'person-add' },
    { title: 'Listar Proveedores', url: '/folder/listar-proveedores', icon: 'people' },
  ];

  public clientPages = [
    { title: 'Crear Cliente', url: '/folder/clientes', icon: 'person-add' },
    { title: 'Listar Clientes', url: '/folder/listar-clientes', icon: 'people' },
    { title: 'Listar Ventas del Mes', url: '/folder/listar-ventas', icon: 'cash' },
  ];

  public bodegaPages = [
    { title: 'Crear Bodega', url: '/folder/crear-bodega', icon: 'home' },
    { title: 'Listar Bodegas', url: '/folder/listar-bodegas', icon: 'archive' },
  ];

  user: any;

  // Estado de expansión para los menús
  showProductMenu = false;
  showProviderMenu = false;
  showClientMenu = false;
  showBodegaMenu = false;

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  toggleProductMenu() {
    this.showProductMenu = !this.showProductMenu;
  }

  toggleProviderMenu() {
    this.showProviderMenu = !this.showProviderMenu;
  }

  toggleClientMenu() {
    this.showClientMenu = !this.showClientMenu;
  }

  toggleBodegaMenu() {
    this.showBodegaMenu = !this.showBodegaMenu;
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.authService.getUserProfile().subscribe(
      (profile) => {
        this.user = profile;
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    );
  }
}
