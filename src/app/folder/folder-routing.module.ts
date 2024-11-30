import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';

const routes: Routes = [
  {
    path: '',
    component: FolderPage
  },

  {
    path: 'proveedores',
    loadChildren: () => import('./proveedores/proveedores.module').then( m => m.ProveedoresPageModule)
  },
  {
    path: 'listar-proveedores',
    loadChildren: () => import('./listar-proveedores/listar-proveedores.module').then( m => m.ListarProveedoresPageModule)
  },
  {
    path: 'listar-ordenes',
    loadChildren: () => import('./listar-ordenes/listar-ordenes.module').then( m => m.ListarOrdenesPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'listar-clientes',
    loadChildren: () => import('./listar-clientes/listar-clientes.module').then( m => m.ListarClientesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'crear-categoria',
    loadChildren: () => import('./crear-categoria/crear-categoria.module').then( m => m.CrearCategoriaPageModule)
  },
  {
    path: 'crear-producto',
    loadChildren: () => import('./crear-producto/crear-producto.module').then( m => m.CrearProductoPageModule)
  },
  {
    path: 'listar-ventas',
    loadChildren: () => import('./listar-ventas/listar-ventas.module').then( m => m.ListarVentasPageModule)
  },
  {
    path: 'proveedor-ubicacion',
    loadChildren: () => import('./proveedor-ubicacion/proveedor-ubicacion.module').then( m => m.ProveedorUbicacionPageModule)
  },
  {
    path: 'main-dashboar',
    loadChildren: () => import('./main-dashboar/main-dashboar.module').then( m => m.MainDashboarPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
