import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearBodegaPage } from './crear-bodega.page';

const routes: Routes = [
  {
    path: '',
    component: CrearBodegaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearBodegaPageRoutingModule {}
