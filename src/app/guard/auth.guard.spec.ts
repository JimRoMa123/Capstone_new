import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Mock del router para capturar navegaciones
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
  });

  it('debería crear el guard', () => {
    expect(authGuard).toBeTruthy();
  });

  it('debería permitir acceso si el usuario está autenticado', () => {
    localStorage.setItem('token', 'mock-token'); // Simula un token en localStorage
    const result = authGuard.canActivate();
    expect(result).toBeTrue();
  });

  it('debería bloquear acceso y redirigir a /login si el usuario no está autenticado', () => {
    localStorage.removeItem('token'); // Elimina el token para simular un usuario no autenticado
    const result = authGuard.canActivate();
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
