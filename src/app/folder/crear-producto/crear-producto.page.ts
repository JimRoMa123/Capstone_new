// src/app/folder/crear-producto/crear-producto.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ProveedorService } from '../../services/proveedor.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
})
export class CrearProductoPage implements OnInit {
  productForm: FormGroup; // Formulario para el producto
  proveedores: any[] = [];
  categorias: any[] = [];
  isProveedorModalOpen = false;
  isCategoriaModalOpen = false;
  selectedProveedorName = '';
  selectedCategoriaName = '';

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService,
    private http: HttpClient
  ) {
    // Configuración del formulario
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      img: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      proveedor_id: ['', Validators.required],
      categoria_id: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      user_id: [1], // Valor fijo para el campo user_id
    });
  }

  ngOnInit() {
    this.loadProveedores();
    this.loadCategorias();
  }

  // Cargar Proveedores
  loadProveedores() {
    this.proveedorService.getProveedoresData().subscribe(
      (data) => (this.proveedores = data),
      (error) => console.error('Error al cargar proveedores:', error)
    );
  }

  // Cargar Categorías
  loadCategorias() {
    this.categoriaService.getCategoria().subscribe(
      (data) => (this.categorias = data),
      (error) => console.error('Error al cargar categorías:', error)
    );
  }

  // Funciones para abrir y cerrar modales
  openProveedorModal() {
    this.isProveedorModalOpen = true;
  }

  closeProveedorModal() {
    this.isProveedorModalOpen = false;
  }

  openCategoriaModal() {
    this.isCategoriaModalOpen = true;
  }

  closeCategoriaModal() {
    this.isCategoriaModalOpen = false;
  }

  // Seleccionar proveedor
  selectProveedor(proveedor: any) {
    this.productForm.patchValue({ proveedor_id: proveedor.id });
    this.selectedProveedorName = proveedor.nombre;
    this.closeProveedorModal();
  }

  // Seleccionar categoría
  selectCategoria(categoria: any) {
    this.productForm.patchValue({ categoria_id: categoria.id });
    this.selectedCategoriaName = categoria.nombre;
    this.closeCategoriaModal();
  }

  // Función para enviar el formulario
  async addProduct() {
    if (this.productForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Faltan datos obligatorios',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      const response: any = await this.http
        .post('http://localhost:3000/add-producto', this.productForm.value)
        .toPromise();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: response.message || 'Producto agregado correctamente',
        buttons: ['OK'],
      });
      await alert.present();

      this.productForm.reset();
      this.productForm.patchValue({ user_id: 1 }); // Restablece user_id a 1 después de limpiar
      this.selectedProveedorName = '';
      this.selectedCategoriaName = '';
    } catch (error) {
      console.error('Error al agregar producto:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al agregar el producto',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
