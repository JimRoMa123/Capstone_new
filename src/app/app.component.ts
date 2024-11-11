import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Listar de Proveedores', url: '/folder/listar-proveedores', icon: 'pricetags' },
    { title: 'Proveedores', url: '/folder/proveedores', icon: 'pricetag' },
    { title: 'Crear categoria', url: '/folder/crear-categoria', icon: 'pricetags' },
    { title: 'Crear producto', url: '/folder/crear-producto', icon: 'pricetags' },
    { title: 'Listar ordenes de compra', url: '/folder/listar-ordenes', icon: 'pricetags' },
    { title: 'Crear Cliente', url: '/folder/clientes', icon: 'pricetags' },
    { title: 'Listar Clientes', url: '/folder/listar-clientes', icon: 'pricetags' },
    
  ];
  public labels = [''];
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const token = localStorage.getItem('token'); // Asegúrate de que el token se haya guardado en el localStorage al iniciar sesión
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
