import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProveedorUbicacionPage } from './proveedor-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: ProveedorUbicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProveedorUbicacionPageRoutingModule {}
