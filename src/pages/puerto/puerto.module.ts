import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PuertoPage } from './puerto';

@NgModule({
  declarations: [
    PuertoPage,
  ],
  imports: [
    IonicPageModule.forChild(PuertoPage),
  ],
  exports: [
    PuertoPage
  ]
})
export class PuertoPageModule {}
