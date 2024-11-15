import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public providerPages = [
    { title: 'Crear Producto', url: '/folder/crear-producto', icon: 'cube' },
    { title: 'Crear proveedor', url: '/folder/proveedores', icon: 'people-outline' },
    { title: 'Listar de Proveedores', url: '/folder/listar-proveedores', icon: 'list' },
    { title: 'Crear Categoría', url: '/folder/crear-categoria', icon: 'layers' },
    { title: 'Listar Órdenes de Compra', url: '/folder/listar-ordenes', icon: 'receipt' },
  ];

  public clientPages = [
    { title: 'Crear Cliente', url: '/folder/clientes', icon: 'person-add' },
    { title: 'Listar Clientes', url: '/folder/listar-clientes', icon: 'people' },
  ];

  public labels = [''];
  user: any;

  showProviderMenu = false;
  showClientMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  toggleProviderMenu() {
    this.showProviderMenu = !this.showProviderMenu;
  }

  toggleClientMenu() {
    this.showClientMenu = !this.showClientMenu;
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
