import { PuertoPage } from './../puerto/puerto';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import mapboxgl from 'mapbox-gl';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the UbicacionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ubicacion',
  templateUrl: 'ubicacion.html',
})
export class UbicacionPage {

  @ViewChild('contenedorMapa') contenedorMapa: ElementRef;
  map: any;
  loader: any;

  localization: any;
  miLong: any;
  niveles: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    this.presentLoading();

    this.geolocation.getCurrentPosition({ timeout: 10000 }).then(
      (resp) => {
        this.localization = resp;
        this.initMapa();
      }).catch((error) => {
        console.log('Error getting location', error);
        this.localization = {
          coords: {
            longitude: -55.89,
            latitude: -27.36,
          }
        }
        this.initMapa();
      });

  }

  initMapa() {
    let mapId = 'map';
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2lvc2FuYWJyaWEiLCJhIjoiY2oza2ZscXh4MDBvajMzb3poaGkxajhkayJ9.jZ8b6iJnVkTDwoE6nbAzrQ';
    this.contenedorMapa.nativeElement.innerHTML = '<div class="map" id="' + mapId + '"></div>';
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v10', //stylesheet location
      center: [this.localization.coords.longitude, this.localization.coords.latitude], // starting position
      zoom: 7 // starting zoom
    });
    this.cargarMapa();
  }

  cargarMapa() {

    this.storage.get('niveles').then(
      (val) => {

        this.niveles = val.niveles;
        for (let nivel of this.niveles) {
          if (!nivel.longitud || !nivel.latitud) {
            continue;
          }
          var el = document.createElement('div');
          el.className = 'marker';

          let variacion = nivel.variacion ? parseFloat(nivel.variacion) : false;
          let variacionStr: String;
          let color = '';

          if (variacion !== false) {
            if (variacion > 0) {
              el.className += ' up';
              variacionStr = ' ↑ ' + variacion;
              color = "#f53d3d";
            } else if (variacion < 0) {
              el.className += ' down';
              variacionStr = ' ↓ ' + variacion;
              color = "#32db64";
            } else if (variacion == 0) {
              el.className += ' equal';
              variacionStr = ' = ' + variacion;
              color = "#488aff";
            }
          }

          if (!isNaN(nivel.longitud)) {
            console.log('nivel', nivel);

            let marker = new mapboxgl.Marker(el)
              .setLngLat([nivel.longitud, nivel.latitud]);
            // .setLngLat([-25, -54]);

            let popUpDiv = document.createElement('div');
            popUpDiv.style.color = color;
            popUpDiv.innerHTML += "<p><b>Rio</b>: " + nivel.rio + "</p>";
            popUpDiv.innerHTML += "<p><b>Puerto</b>: " + nivel.puerto + "</p>";

            if (variacion !== 0) {
              popUpDiv.innerHTML += "<p><b>Variacion</b>: " + variacionStr + " mts</span></p>";
            }

            popUpDiv.innerHTML += "<p><b>Nivel</b>: " + nivel.ultimo_registro + " mts</p>";

            popUpDiv.addEventListener('click', () => {
              this.puertoDetails(nivel);
            });

            let popUp = new mapboxgl.Popup()
              .setDOMContent(popUpDiv);

            marker.setPopup(
              popUp
            );
            marker.addTo(this.map);
          }

        }
        this.dismissLoading();
      });
  }

  // to base class
  puertoDetails(nivel) {
    this.navCtrl.push(PuertoPage, {
      puerto: nivel
    });
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
