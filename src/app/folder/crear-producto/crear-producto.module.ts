// src/app/folder/crear-producto/crear-producto.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Asegúrate de importar ReactiveFormsModule aquí
import { IonicModule } from '@ionic/angular';
import { CrearProductoPage } from './crear-producto.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CrearProductoPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- Incluye ReactiveFormsModule aquí
    IonicModule,
    RouterModule.forChild([{ path: '', component: CrearProductoPage }])
  ],
})
export class CrearProductoPageModule {}
