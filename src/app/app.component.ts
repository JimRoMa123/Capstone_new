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
  
  
  public providerPages = [
    { title: 'Crear Producto', url: '/folder/crear-producto', icon: 'pricetag' }, 
    { title: 'Crear Proveedor', url: '/folder/proveedores', icon: 'person-add' }, 
    { title: 'Listar Proveedores', url: '/folder/listar-proveedores', icon: 'people' },
    { title: 'Crear Categoría', url: '/folder/crear-categoria', icon: 'grid' }, 
    { title: 'Listar Órdenes de Compra', url: '/folder/listar-ordenes', icon: 'cart' },
    { title: 'Dashboard', url: '/folder/dashboard', icon: 'analytics' }, 
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

  public labels = [''];
  user: any;

  showProviderMenu = false;
  showClientMenu = false;
  showBodegaMenu = false; // Nuevo control para el menú de bodegas

  constructor(private authService: AuthService, private router: Router) {}
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  toggleProviderMenu() {
    this.showProviderMenu = !this.showProviderMenu;
  }

  toggleClientMenu() {
    this.showClientMenu = !this.showClientMenu;
  }

  toggleBodegaMenu() { // Control para mostrar/ocultar el menú de bodegas
    this.showBodegaMenu = !this.showBodegaMenu;
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.authService.getUserProfile().subscribe(
      profile => {
        this.user = profile;
      },
      error => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    );
  }
}
