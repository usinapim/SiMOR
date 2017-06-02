import { Storage } from '@ionic/storage';
import { ApiProvider } from './../providers/api/api';
import { AcercaDePage } from './../pages/acerca-de/acerca-de';
import { TabsPage } from './../pages/tabs/tabs';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


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
    public storage: Storage) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: TabsPage },
      { title: 'Acerca De', component: AcercaDePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.cargarRios();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  cargarRios() {
    this.presentLoading();
    this.apiProvider.getAll('niveles')
      .then(
      (data) => {
        console.log(data);
        this.storage.set('niveles', data);
        this.dismissLoading();
      },
      err => this.handleError.bind(this)
      );
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
