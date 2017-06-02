import { Config } from './config/config';
import { AuthProvider } from './../providers/auth/auth';
import { ApiProvider } from './../providers/api/api';
import { SeleccionarPuertosPageModule } from './../pages/seleccionar-puertos/seleccionar-puertos.module';
import { AcercaDePageModule } from './../pages/acerca-de/acerca-de.module';
import { HomePageModule } from './../pages/home/home.module';
import { UbicacionPageModule } from './../pages/ubicacion/ubicacion.module';
import { NotificacionesPageModule } from './../pages/notificaciones/notificaciones.module';
import { TabsPageModule } from './../pages/tabs/tabs.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AcercaDePageModule,
    TabsPageModule,
    HomePageModule,
    NotificacionesPageModule,
    UbicacionPageModule,
    SeleccionarPuertosPageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__simor',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Config,
    ApiProvider,
    AuthProvider
  ]
})
export class AppModule { }
