import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarVentasPage } from './listar-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: ListarVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarVentasPageRoutingModule {}
