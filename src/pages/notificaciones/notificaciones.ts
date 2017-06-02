import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events, AlertController } from 'ionic-angular';

/**
 * Generated class for the NotificacionesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notificaciones',
  templateUrl: 'notificaciones.html',
})
export class NotificacionesPage {
  loader: any;
  notificaciones: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: ApiProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public events: Events,
    public alertCtrl: AlertController) {

    this.cargarNotificaciones();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificacionesPage');
  }

  cargarNotificaciones() {
    this.presentLoading();
    this.apiProvider.getAll('tips')
      .then(
      (data) => {
        console.log(data.tips);
        this.notificaciones = data.tips;
        this.dismissLoading();
      },
      err => this.handleError.bind(this)
      );
  }

  itemSelected(item) {
    let alert = this.alertCtrl.create({
      title: 'Notificacion!',
      subTitle: item.descripcion,
      buttons: ['OK']
    });
    alert.present();
  }

  // to base class

  handleError(err) {
    if (err.status == 401) {
      this.presentToast('Sesión expirada');
      this.events.publish('user:logout');
    }

    if (err.status == 404) {
      this.presentToast(JSON.parse(err._body).message)
    }
    this.dismissLoading();
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

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
