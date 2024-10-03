import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [

    { title: 'Proveedores', url: '/folder/proveedores', icon: 'pricetag' },
    { title: 'Listar de Proveedores', url: '/folder/listar-proveedores', icon: 'pricetags' },
    { title: 'Listar ordenes de compra', url: '/folder/listar-ordenes', icon: 'pricetags' },
  ];
  public labels = [''];
  constructor() {}
}
