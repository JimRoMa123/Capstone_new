import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearBodegaPageRoutingModule } from './crear-bodega-routing.module';

import { CrearBodegaPage } from './crear-bodega.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearBodegaPageRoutingModule
  ],
  declarations: [CrearBodegaPage]
})
export class CrearBodegaPageModule {}
