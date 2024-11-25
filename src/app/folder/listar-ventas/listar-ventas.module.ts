import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarVentasPageRoutingModule } from './listar-ventas-routing.module';

import { ListarVentasPage } from './listar-ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarVentasPageRoutingModule
  ],
  declarations: [ListarVentasPage]
})
export class ListarVentasPageModule {}
