import { PuertoPageModule } from './../pages/puerto/puerto.module';
import { ConfiguracionPageModule } from './../pages/configuracion/configuracion.module';
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
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';
import { OneSignal } from '@ionic-native/onesignal';
import { Geolocation } from '@ionic-native/geolocation';

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
    PuertoPageModule,
    ConfiguracionPageModule,
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
    AuthProvider,
    SocialSharing,
    Screenshot,
    Geolocation,
    OneSignal
  ]
})
export class AppModule { }
