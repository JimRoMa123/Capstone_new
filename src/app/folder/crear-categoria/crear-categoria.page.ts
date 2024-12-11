import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.page.html',
  styleUrls: ['./crear-categoria.page.scss'],
})
export class CrearCategoriaPage implements OnInit {

  nombre: string = '';
  descripcion: string = '';
  fechaCreacion: Date = new Date();


  constructor(    private http: HttpClient,
    private alertController: AlertController,) { }

  ngOnInit() {
  }


  addCategoria() {
    const categoriaData = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      fecha_creacion: this.fechaCreacion,
    };

    this.http.post('http://localhost:3000/add-categoria', categoriaData).subscribe(
      async () => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Categoria agregada correctamente.',
          buttons: ['OK']
        });
        this.nombre = '';
        this.descripcion = '';
        await alert.present();
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al agregar .',
          buttons: ['OK']
        });
        await alert.present();
        console.error('Error al agregar:', error);
      }
    );
  }
}
