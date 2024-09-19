import { Component, OnInit } from '@angular/core';
import { Proovedores } from 'src/app/models/proovedores';
import { ProovedoresService } from 'src/app/services/proovedores.service';
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage implements OnInit {

  nuevoProovedor: Partial<Proovedores> = {};

  constructor(private proovedoresService: ProovedoresService) {}

  crearProovedor(): void {
    if (
      this.nuevoProovedor.nombre &&
      this.nuevoProovedor.direccion &&
      this.nuevoProovedor.telefono &&
      this.nuevoProovedor.email &&
      this.nuevoProovedor.alias&&
      this.nuevoProovedor.pago
    ) {
      const id = this.proovedoresService.generarIdUnico();

      const proovedor = new Proovedores(
        id,
        this.nuevoProovedor.nombre,
        this.nuevoProovedor.direccion,
        this.nuevoProovedor.telefono,
        this.nuevoProovedor.email,
        this.nuevoProovedor.alias,
        this.nuevoProovedor.pago
      );
      this.proovedoresService.agregarProovedor(proovedor);
      this.nuevoProovedor = {};
      console.log('Proovedor creado: ', proovedor);
    } else {
      alert('Por favor, complete todos los campos');
    }
  }

  ngOnInit() {
  }

}
