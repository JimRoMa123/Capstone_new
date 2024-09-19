import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarProveedoresPageRoutingModule } from './listar-proveedores-routing.module';

import { ListarProveedoresPage } from './listar-proveedores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarProveedoresPageRoutingModule
  ],
  declarations: [ListarProveedoresPage]
})
export class ListarProveedoresPageModule {}
