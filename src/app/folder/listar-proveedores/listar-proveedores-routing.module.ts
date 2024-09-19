import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarProveedoresPage } from './listar-proveedores.page';

const routes: Routes = [
  {
    path: '',
    component: ListarProveedoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarProveedoresPageRoutingModule {}
