import { Config } from './config/config';
import { ConfiguracionPage } from './../pages/configuracion/configuracion';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../providers/api/api';
import { AcercaDePage } from './../pages/acerca-de/acerca-de';
import { TabsPage } from './../pages/tabs/tabs';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
  loader: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public apiProvider: ApiProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public events: Events,
    public storage: Storage,
    private _config: Config,
    private oneSignal: OneSignal) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: TabsPage },
      { title: 'Acerca De', component: AcercaDePage },
      { title: 'Configuración', component: ConfiguracionPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.cargarRios();
      this.initOneSignal();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  cargarRios() {
    this.presentLoading();

    let today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; //January is 0!

    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    let hoy = dd + '/' + mm + '/' + yyyy;

    this.storage.get('niveles').then(
      (val) => {
        console.log(val);
        if (!val || val.fecha !== hoy) {
          this.apiProvider.getAll('niveles')
            .then(
            (data) => {
              let toStore = {
                niveles: data,
                fecha: hoy
              }
              // si cambia el dia elimina el registro viejo
              // y crea uno nuevo  
              this.storage.clear().then(
                () => {
                  this.storage.set('niveles', toStore);
                  this.dismissLoading();
                }
              )
            },
            err => this.handleError.bind(this)
            );
        } else {
          this.dismissLoading();
        }
      },
      (err) => {
        console.error('err', err)
      });

  }

  initOneSignal() {

    this.storage.get('notificaciones').then(
      (val) => {
        if (!val) {
          // this.storage.set('notificaciones', true);
          // this.oneSignal.startInit(this._config.get('oneSignalAppId'), this._config.get('googleProjectNumber'));

          // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

          // this.oneSignal.handleNotificationReceived().subscribe(() => {
          //   // do something when notification is received
          // });

          // this.oneSignal.handleNotificationOpened().subscribe(() => {
          //   // do something when a notification is opened
          // });

          // this.oneSignal.endInit();
        }

      },
      (err) => {
        console.error('notificaciones err', err)
      });

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
