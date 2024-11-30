import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, HighchartsChartModule ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthService,  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true, // Esto permite tener múltiples interceptores si es necesario
  },],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
