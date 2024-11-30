import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainDashboarPageRoutingModule } from './main-dashboar-routing.module';

import { MainDashboardPage } from './main-dashboar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainDashboarPageRoutingModule
  ],
  declarations: [MainDashboardPage]
})
export class MainDashboarPageModule {}
