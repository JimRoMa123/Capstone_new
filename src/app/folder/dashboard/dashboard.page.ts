import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  ventasMes: number = 0;
  ventasSemanales: number[] = [];
  estadoCompras: { estado: string; total: number }[] = [];
  pedidosRecientes: any[] = [];
  totalProveedores: number = 0;
  topClientes: any[] = [];
  transferenciasCount: number = 0;
  transferenciasProgress: number = 0;
  proveedorEstrella: any = { nombre: '', total_ventas: 0 };
  isLoading: boolean = true;

  constructor(private http: HttpClient, private alertController: AlertController) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;

    // Ventas del mes y semanales
    this.http.get<{ total_ventas: number; ventas_semanales: number[] }>('http://localhost:3000/ventas-mes').subscribe(
      (response) => {
        this.ventasMes = response.total_ventas;
        this.ventasSemanales = response.ventas_semanales;
        this.dibujarGrafico(); // Renderizar el gráfico después de cargar los datos
      },
      (error) => {
        console.error('Error al obtener ventas del mes:', error);
      }
    );

    // Otros datos...
    this.http.get<number>('http://localhost:3000/total-proveedores').subscribe(
      (response) => {
        this.totalProveedores = response;
      },
      (error) => {
        console.error('Error al obtener total de proveedores:', error);
      }
    );

    this.http.get<{ count: number }>('http://localhost:3000/transferencias-mes').subscribe(
      (response) => {
        this.transferenciasCount = response.count;
        this.transferenciasProgress = Math.min((this.transferenciasCount / 50) * 100, 100);

        // Mostrar alerta si las transferencias están entre 40 y 50
        if (this.transferenciasCount >= 40 && this.transferenciasCount <= 50) {
          this.mostrarAlertaTransferencias();
        }
      },
      (error) => {
        console.error('Error al obtener transferencias del mes:', error);
      }
    );

    

    this.http.get<any[]>('http://localhost:3000/top-clientes').subscribe(
      (response) => {
        this.topClientes = response;
      },
      (error) => {
        console.error('Error al obtener clientes destacados:', error);
      }
    );

    this.http.get<{ nombre: string; total_ventas: number }>('http://localhost:3000/proveedor-estrella').subscribe(
      (response) => {
        this.proveedorEstrella = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener proveedor estrella:', error);
        this.isLoading = false;
      }
    );

    this.http.get<any[]>('http://localhost:3000/pedidos').subscribe(
      (response: any) => {
        this.pedidosRecientes = response.data;
      },
      (error) => {
        console.error('Error al obtener pedidos recientes:', error);
      }
    );
  }


  async mostrarAlertaTransferencias() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: `El número de transferencias está en un rango alto (${this.transferenciasCount}).`,
      buttons: ['OK'],
    });
    await alert.present();
  }
  dibujarGrafico() {
    const canvas = document.getElementById('ventasSemanalesChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas antes de redibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración del gráfico
    const barWidth = 50;
    const barSpacing = 20;
    const chartHeight = canvas.height - 50;
    const maxValue = Math.max(...this.ventasSemanales, 1); // Evitar división por 0
    const scale = chartHeight / maxValue;

    // Dibujar las barras
    this.ventasSemanales.forEach((value, index) => {
      const x = 60 + index * (barWidth + barSpacing);
      const barHeight = value * scale;
      const y = chartHeight - barHeight;

      ctx.fillStyle = '#007bff'; // Color de las barras
      ctx.fillRect(x, y, barWidth, barHeight);

      // Etiquetas de valor encima de las barras
      ctx.fillStyle = '#000';
      ctx.fillText(value.toString(), x + 15, y - 10);

      // Etiquetas de las semanas debajo de las barras
      ctx.fillStyle = '#555';
      ctx.fillText(`S${index + 1}`, x + 15, canvas.height - 10);
    });
  }
}
