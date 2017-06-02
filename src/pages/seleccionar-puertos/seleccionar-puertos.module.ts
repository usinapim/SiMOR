import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeleccionarPuertosPage } from './seleccionar-puertos';

@NgModule({
  declarations: [
    SeleccionarPuertosPage,
  ],
  imports: [
    IonicPageModule.forChild(SeleccionarPuertosPage),
  ],
  exports: [
    SeleccionarPuertosPage
  ]
})
export class SeleccionarPuertosPageModule {}
