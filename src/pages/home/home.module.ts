import { HomePage } from './home';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

declare var require: any;
export function highchartsFactory() {
  var hc = require('highcharts');
  var hcm = require('highcharts/highcharts-more');
  hcm(hc);
  return hc;
}

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    ChartModule,
    IonicPageModule.forChild(HomePage),
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule { }
