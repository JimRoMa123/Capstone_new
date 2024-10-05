import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarOrdenesPage } from './listar-ordenes.page';

const routes: Routes = [
  {
    path: '',
    component: ListarOrdenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarOrdenesPageRoutingModule {}
