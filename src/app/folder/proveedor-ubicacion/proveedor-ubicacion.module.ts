import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProveedorUbicacionPageRoutingModule } from './proveedor-ubicacion-routing.module';

import { ProveedorUbicacionPage } from './proveedor-ubicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProveedorUbicacionPageRoutingModule
  ],
  declarations: [ProveedorUbicacionPage]
})
export class ProveedorUbicacionPageModule {}
