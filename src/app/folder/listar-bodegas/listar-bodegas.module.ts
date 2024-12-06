import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarBodegasPageRoutingModule } from './listar-bodegas-routing.module';

import { ListarBodegasPage } from './listar-bodegas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarBodegasPageRoutingModule
  ],
  declarations: [ListarBodegasPage]
})
export class ListarBodegasPageModule {}
