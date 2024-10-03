import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarOrdenesPageRoutingModule } from './listar-ordenes-routing.module';

import { ListarOrdenesPage } from './listar-ordenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarOrdenesPageRoutingModule
  ],
  declarations: [ListarOrdenesPage]
})
export class ListarOrdenesPageModule {}
