import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { Screenshot } from '@ionic-native/screenshot';
import { SocialSharing } from '@ionic-native/social-sharing';
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private screenshot: Screenshot,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private api: ApiProvider) {

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
  share() {
    this.screenshot.URI(80).then(
      (data) => {
        let mensaje = 'Río: ' + this.puertoSelect.rio + '\n' +
          'Puerto: ' + this.puertoSelect.puerto + '\n' +
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

  getRotacionViento(grado) {

    grado = parseFloat(grado);

    let direccion = "N/D";
    if ((grado >= 0 && grado <= 11.25) || grado > 348.75 && grado <= 360) {
      direccion = "N";
    }
    if ((grado > 11.25 && grado <= 33.75)) {
      direccion = "NNE";
    }
    if ((grado > 33.75 && grado <= 56.25)) {
      direccion = "NE";
    }
    if ((grado > 56.25 && grado <= 78.75)) {
      direccion = "ENE";
    }
    if ((grado > 78.75 && grado <= 101.25)) {
      direccion = "E";
    }
    if ((grado > 101.25 && grado <= 123.75)) {
      direccion = "ESE";
    }
    if ((grado > 123.75 && grado <= 146.25)) {
      direccion = "SE";
    }
    if ((grado > 146.25 && grado <= 168.75)) {
      direccion = "SSE";
    }
    if ((grado > 168.75 && grado <= 191.25)) {
      direccion = "S";
    }
    if ((grado > 191.25 && grado <= 213.75)) {
      direccion = "SSO";
    }
    if ((grado > 213.75 && grado <= 236.25)) {
      direccion = "SO";
    }
    if ((grado > 236.25 && grado <= 258.75)) {
      direccion = "OSO";
    }
    if ((grado > 258.25 && grado <= 281.75)) {
      direccion = "O";
    }
    if ((grado > 281.25 && grado <= 303.75)) {
      direccion = "ONO";
    }
    if ((grado > 303.25 && grado <= 326.75)) {
      direccion = "NO";
    }
    if ((grado > 326.25 && grado <= 348.75)) {
      direccion = "NNO";
    }

    return direccion;

  }


}
