import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {
  nombre: string = '';
  apellido: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  fecha_nacimiento: string = '';
  genero: string = '';
  rut: string = '';
  


  constructor(private http: HttpClient, private alertController: AlertController) {}

  addCliente() {
    const today = new Date();
    const fechaCreacion = today.toISOString(); // Formato ISO para la fecha de creación
  
    const clienteData = {
      nombre: this.nombre,
      apellido: this.apellido,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      fecha_nacimiento: this.fecha_nacimiento,
      genero: this.genero,
      fecha_creacion: fechaCreacion,
      rut: this.rut // Añadiendo la fecha de creación
    };
  
    this.http.post('http://localhost:3000/add-cliente', clienteData).subscribe(
      async (response: any) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Cliente agregado correctamente.',
          buttons: ['OK']
        });
        await alert.present();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al agregar el cliente.',
          buttons: ['OK']
        });
        await alert.present();
        console.error('Error al agregar cliente:', error);
      }
    );
  }
  
  
}


