import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/folder/listar-clientes']);
    }
  }

  ionViewWillEnter() {
    // Deshabilita el menú al entrar en la página de login
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // Habilita el menú al salir de la página de login
    this.menuCtrl.enable(true);
  }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/folder/dashboard']); // Redirige al dashboard
          this.errorMessage = '';
        } else {
          this.errorMessage =
            'Inicio de sesión fallido. Por favor, verifica tus credenciales.';
        }
      },
      (error) => {
        this.errorMessage = 'Error de autenticación. Inténtalo de nuevo más tarde.';
        console.error('Error de autenticación:', error);
      }
    );
  }
}
