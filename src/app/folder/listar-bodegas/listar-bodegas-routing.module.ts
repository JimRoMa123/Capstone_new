import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarBodegasPage } from './listar-bodegas.page';

const routes: Routes = [
  {
    path: '',
    component: ListarBodegasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarBodegasPageRoutingModule {}
