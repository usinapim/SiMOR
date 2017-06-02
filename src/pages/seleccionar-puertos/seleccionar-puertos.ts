import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';

/**
 * Generated class for the SeleccionarPuertosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-seleccionar-puertos',
  templateUrl: 'seleccionar-puertos.html',
})
export class SeleccionarPuertosPage {

  private loader: any;
  searchQuery: string = '';
  items: string[];

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public apiProvider: ApiProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public events: Events,
  ) {

    // this.items = navParams.get('niveles');

    this.initializeItems();
  }

  initializeItems() {
    this.items = this.navParams.get('niveles');
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;
    
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        let str = JSON.stringify(item);
        str = str.toLowerCase();
        val = val ? val.toLowerCase() : '';
        // arg2 = arg2 ? arg2.toLowerCase() : '';

        return str.indexOf(val) >= 0;

      });
    }
  }

  dismiss(item?) {

    if (item) {
      let data = { 'puerto': item };
      this.viewCtrl.dismiss(data);
    } else {
      this.viewCtrl.dismiss();
    }

  }

  // to base class

  handleError(err) {
    if (err.status == 401) {
      this.presentToast('Sesión expirada');
      this.events.publish('user:logout');
    }

    if (err.status == 404) {
      this.presentToast(JSON.parse(err._body).message)
      this.navCtrl.pop();
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
