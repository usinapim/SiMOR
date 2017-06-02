import { HomePage } from './home';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ChartModule } from 'angular2-highcharts';

declare var require: any

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    ChartModule.forRoot(
      require('highcharts'),
      require('highcharts/highcharts-more'),
    ),
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule { }
