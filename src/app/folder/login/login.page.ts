import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/folder/listar-clientes']);
    }
  }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        this.router.navigate(['/folder/main-dashboard']); // Redirige al dashboard
        this.errorMessage = ''; 
      } else {
        this.errorMessage = 'Inicio de sesión fallido. Por favor, verifica tus credenciales.';
      }
    }, error => {
      this.errorMessage = 'Error de autenticación. Inténtalo de nuevo más tarde.';
      console.error('Error de autenticación:', error);
    });
  }
  
  
  
}
