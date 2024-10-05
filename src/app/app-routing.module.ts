import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProveedoresPage } from './folder/proveedores/proveedores.page';
import { ListarOrdenesPage } from './folder/listar-ordenes/listar-ordenes.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/listar-proveedores',  // Redirige a listar proveedores
    pathMatch: 'full'
  },
  {path: 'folder/listar-proveedores',
    loadChildren: () => import('./folder/listar-proveedores/listar-proveedores.module').then(m=>m.ListarProveedoresPageModule)
  },
  {
    path: 'folder/proveedores',
    loadChildren: () => import('./folder/proveedores/proveedores.module').then(m => m.ProveedoresPageModule)
  },

  {
    path: 'folder/listar-ordenes',
    loadChildren: () => import('./folder/listar-ordenes/listar-ordenes.module').then( m => m.ListarOrdenesPageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  }
  
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
