import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Proovedores } from 'src/app/models/proovedores';
import { ProovedoresService } from 'src/app/services/proovedores.service';
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage{
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';

  constructor(private http: HttpClient, private alertController: AlertController) {}
 

  addProveedor() {
    const today = new Date();
    const fechaCreacion = today;
  
    const proveedorData = {
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      fecha_creacion: fechaCreacion,
      fecha_actualizacion: fechaCreacion,
    };
  
    this.http.post('http://localhost:3000/add-proveedor', proveedorData).subscribe(
      async (response: any) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'proveedor agregado correctamente.',
          buttons: ['OK']
        });
        await alert.present();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al agregar el proveedor.',
          buttons: ['OK']
        });
        await alert.present();
        console.error('Error al agregar proveedor:', error);
      }
    );
  }
  

}
