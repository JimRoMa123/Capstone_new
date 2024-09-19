import { Component, OnInit } from '@angular/core';
import { Proovedores } from 'src/app/models/proovedores';
import { ProovedoresService } from 'src/app/services/proovedores.service';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-listar-proveedores',
  templateUrl: './listar-proveedores.page.html',
  styleUrls: ['./listar-proveedores.page.scss'],
  providers: [EmailComposer]

  
})
export class ListarProveedoresPage implements OnInit {
  proovedores: Proovedores[] = [];

  constructor(
    private proovedoresService: ProovedoresService,

    private emailComposer: EmailComposer,


    private platform: Platform
  ) {}

  ionViewWillEnter() {
    this.proovedores = this.proovedoresService.obtenerProovedores();
  }
  enviarCorreo(proovedor: Proovedores) {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {

      let email = {
        to: proovedor.email,
        subject: 'Asunto del correo',
        body: `Hola ${proovedor.nombre}, este es un mensaje para ti.`,
        isHtml: true
      };

      this.emailComposer.open(email);
    } else {
    
      console.log('Cordova o Capacitor no están disponibles. Ejecuta en un dispositivo.');
      alert('La funcionalidad de correo no está disponible en el navegador.');
    }
  }
  ngOnInit() {
  }

}
