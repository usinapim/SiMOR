import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';

/**
 * Generated class for the ConfiguracionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  notificacion = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private oneSignal: OneSignal) {

    this.storage.get('notificaciones').then(
      (val) => {
        if (!val) {
          this.notificacion = false;
        } else {
          this.notificacion = true;
        }
      },
      (err) => {
        console.error('notificaciones err', err)
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');
  }

  toggleNotification() {
    // console.log(this.notificacion);
    this.oneSignal.setSubscription(this.notificacion);
  }


}
