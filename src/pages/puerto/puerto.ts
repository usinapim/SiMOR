import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the PuertoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-puerto',
  templateUrl: 'puerto.html',
})
export class PuertoPage {

  puertoSelect: any;
  variacion: any;
  tiempo: any;

  colorPrincipal = "#393939";
  colorBarra = "#607d8b";
  colorNormal = "#387EF5";
  colorAlerta = "#FFC900";
  colorEvacuacion = "#EF473A";
  colorBajaNivel = "#33CD5F";

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private api: ApiProvider) {

    this.puertoSelect = this.navParams.get('puerto');
    this.setDataPuerto();
    this.setTiempoMet();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PuertoPage');
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  setDataPuerto() {
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

      this.variacion = this.getVariacion(this.puertoSelect.variacion);

    }
  }

  setTiempoMet() {
    this.api.openWeatherApi(this.puertoSelect.latitud, this.puertoSelect.longitud)
      .then((data) => {
        this.tiempo = data;
      });
  }

  kalvinToCentigrado(t) {
    return t - 271;
  }

  mpsToKmh(v) {
    return v * 3.6;
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


}
