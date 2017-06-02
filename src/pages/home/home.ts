import { Storage } from '@ionic/storage';
import { SeleccionarPuertosPage } from './../seleccionar-puertos/seleccionar-puertos';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Screenshot } from '@ionic-native/screenshot';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: any;
  fechaDatos: any;

  options: Object;
  chart: any;
  saveInstance(chartInstance) {
    this.chart = chartInstance;
  }


  colorPrincipal = "#393939";
  colorBarra = "#607d8b";
  colorNormal = "#387EF5";
  colorAlerta = "#FFC900";
  colorEvacuacion = "#EF473A";
  colorBajaNivel = "#33CD5F";

  puerto = 'Seleccionar Puerto';
  dataToSend: any;
  rio: any;
  puertoSelect: any;
  variacion = {};


  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    private socialSharing: SocialSharing,
    private screenshot: Screenshot) {

    this.options = {
      chart: {
        type: 'gauge',
        // plotBackgroundColor: this.colorPrincipal,
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#FFF'],
              [1, '#333']
            ]
          },
          borderWidth: 0,
          outerRadius: '109%'
        },
        {
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#333'],
              [1, '#FFF']
            ]
          },
          borderWidth: 1,
          outerRadius: '107%'
        },
        {
          // default background
        },
        {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '105%',
          innerRadius: '103%'
        }]
      },
      title: 'Medidor de alturas',
      yAxis: {
        min: 0,
        max: 200,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 30,
        tickWidth: 1,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto'
        },
        title: {
          text: 'mts'
        },
        plotBands: [{
          id: 'normal',
          from: 0,
          to: 100,
          color: this.colorNormal
          //                            color: '#55BF3B' // green
        }, {
          id: 'alerta',
          from: 100,
          to: 150,
          color: this.colorAlerta
          //color: '#DDDF0D'  yellow
        }, {
          id: 'evacuacion',
          from: 150,
          to: 200,
          color: this.colorEvacuacion
          //color: '#DF5353'  red
        }]
      },
      series: this.getSeries(),
      loading: false
    }
  }

  itemSelected() {
    if (!this.chart.renderer.forExport) {
      console.log('this.chart', this.chart);

      let point = this.chart.series[0].points[0];
      let newVal;

      // actualizo los ejes
      let max = 20;
      let alerta = 10;
      let evacuacion = 15;

      if (this.puertoSelect) {
        if (this.puertoSelect.evacuacion && parseFloat(this.puertoSelect.evacuacion) > 0) {
          max = parseFloat(this.puertoSelect.evacuacion) * 1.2;
          evacuacion = parseFloat(this.puertoSelect.evacuacion);
        }

        if (this.puertoSelect.alerta && parseFloat(this.puertoSelect.alerta) > 0) {
          alerta = parseFloat(this.puertoSelect.alerta);
        }

      }

      this.chart.yAxis[0].removePlotBand('normal');
      this.chart.yAxis[0].removePlotBand('alerta');
      this.chart.yAxis[0].removePlotBand('evacuacion');

      this.chart.yAxis[0].setExtremes(0, max)

      this.chart.yAxis[0].addPlotBand(
        { id: "normal", from: 0, to: alerta, color: this.colorNormal }
      );
      this.chart.yAxis[0].addPlotBand(
        { id: "alerta", from: alerta, to: evacuacion, color: this.colorAlerta }
      );
      this.chart.yAxis[0].addPlotBand(
        { id: "evacuacion", from: evacuacion, to: max, color: this.colorEvacuacion }
      );

      // actualizo las series
      newVal = this.getSeries(this.puertoSelect.ultimo_registro);
      point.update(newVal[0].data);

      // actualizo los valores de las descripciones
      this.variacion = this.getVariacion(this.puertoSelect.variacion);
    }
  }

  getSeries(data?: any) {
    if (!data) {
      data = 0;
    }
    var series = [{
      name: 'Altura del río',
      data: [parseFloat(data)],
      dataLabels: {
        formatter: function () {
          var mts = this.y;
          return '<span style="color:#000">' + mts + ' mts</span><br/>';
        },
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, '#DDD'],
            [1, '#FFF']
          ]
        }
      },
      tooltip: {
        valueSuffix: ' mts'
      }
    }];

    return series;
  }

  getVariacion(variacion) {
    variacion = parseFloat(variacion);
    var retorno = {};
    if (variacion == 0) {
      retorno = {
        variacion: variacion,
        icono: 'checkmark',
        color: this.colorNormal
      };
    } else if (variacion > 0) {
      retorno = {
        variacion: variacion,
        icono: 'arrow-up',
        color: this.colorEvacuacion
      };

    } else if (variacion < 0) {
      retorno = {
        variacion: variacion,
        icono: 'arrow-down',
        color: this.colorBajaNivel
      };
    }

    return retorno;
  }

  openModalSeleccionarPuertos() {
    this.presentLoading();
    this.storage.get('niveles').then(
      (val) => {
        this.fechaDatos = val.fecha;
        let modal = this.modalCtrl.create(SeleccionarPuertosPage, { "niveles": val.niveles });
        modal.onDidDismiss(data => {
          if (data) {
            this.dataToSend = data;
            this.puertoSelect = data.puerto;
            this.puerto = data.puerto.puerto;
            this.rio = data.puerto.rio;
            this.itemSelected();
          }
        });
        this.dismissLoading();
        modal.present();
      });
  }

  share() {
    this.screenshot.URI(80).then(
      (data) => {
        let mensaje = 'Río: ' + this.dataToSend.puerto.rio + '\n' +
          'Puerto: ' + this.dataToSend.puerto.puerto + '\n' +
          'Descarga el SiMOR de: '
          ;
        this.socialSharing.share(mensaje, 'SiMORA', data.URI, 'https://play.google.com/store/apps/details?id=org.pim.simor').then(() => {
          // Sharing via email is possible
          console.log('shared');
        }).catch(() => {
          // Sharing via email is not possible
          console.error('error sharing');
        });
      }
      , (err) => {
        console.error('err screenshot', err);
      });

  }

  // to base class
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Cargando...",
    });
    this.loader.present();
  }

  dismissLoading() {

    console.log(this.loader);
    if (this.loader) {
      this.loader.dismiss();
    }

  }

}
