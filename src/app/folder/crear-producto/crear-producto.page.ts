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
  productForm: FormGroup;
  proveedores: any[] = [];
  categorias: any[] = [];
  isProveedorModalOpen = false;
  isCategoriaModalOpen = false;
  selectedProveedorName = '';
  selectedCategoriaName = '';
  calculatedPrecioVenta = 0;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService,
    private http: HttpClient
  ) {
    const currentDate = new Date().toISOString(); // Fecha actual

    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      img: ['', Validators.required],
      sku: ['', Validators.required],
      proveedor_id: ['', Validators.required],
      categoria_id: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      porc_ganancias: [null, [Validators.required, Validators.min(0)]],
      precio_compra: [null, [Validators.required, Validators.min(0.01)]],
      fecha_creacion: [currentDate, Validators.required], // Fecha de creación inicializada automáticamente
    });
  }

  ngOnInit() {
    this.loadProveedores();
    this.loadCategorias();
  }

  loadProveedores() {
    this.proveedorService.getProveedoresData().subscribe(
      (data) => (this.proveedores = data),
      (error) => console.error('Error al cargar proveedores:', error)
    );
  }

  loadCategorias() {
    this.categoriaService.getCategoria().subscribe(
      (data) => (this.categorias = data),
      (error) => console.error('Error al cargar categorías:', error)
    );
  }

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

  selectProveedor(proveedor: any) {
    this.productForm.patchValue({ proveedor_id: proveedor.id });
    this.selectedProveedorName = proveedor.nombre;
    this.closeProveedorModal();
  }

  selectCategoria(categoria: any) {
    this.productForm.patchValue({ categoria_id: categoria.id });
    this.selectedCategoriaName = categoria.nombre;
    this.closeCategoriaModal();
  }

  updatePrecioVenta() {
    const precioCompra = this.productForm.get('precio_compra')?.value || 0;
    const porcGanancias = this.productForm.get('porc_ganancias')?.value || 0;

    this.calculatedPrecioVenta = precioCompra + (precioCompra * porcGanancias) / 100;
  }

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

    const formValue = {
      ...this.productForm.value,
      precio_venta: this.calculatedPrecioVenta, // Usar el precio calculado
    };

    try {
      const response: any = await this.http
        .post('http://localhost:3000/add-producto', formValue)
        .toPromise();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: response.message || 'Producto agregado correctamente',
        buttons: ['OK'],
      });
      await alert.present();

      this.productForm.reset({
        fecha_creacion: new Date().toISOString(), // Restablece con la fecha actual
      });
      this.selectedProveedorName = '';
      this.selectedCategoriaName = '';
      this.calculatedPrecioVenta = 0;
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
