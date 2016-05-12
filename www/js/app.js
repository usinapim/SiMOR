// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

servidor = 'http://fundacionpim.com.ar/';

angular.module('app', ['ionic', 'highcharts-ng', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ion-autocomplete'])

        .run(function ($ionicPlatform, $http, $rootScope) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                var puertos = [];
                var ubicacion = [];
                var ubicacionConCoordenada = [];
                $http.get(servidor + 'simor_web_service/api/niveles.json').
                        success(function (data) {

                            angular.forEach(data.puertos, function (dato) {

                                if (dato.evacuacion != '-' && dato.puerto != 'undefined') {
                                    puertos.push(dato);

                                    ubicacion.push(dato.puerto);
                                    if (dato.latitud != undefined && dato.longitud != undefined) {
                                        ubicacionConCoordenada.push(dato);
                                    }
                                }

                            });

                            ubicacion.sort();

                            $rootScope.puertos = puertos;
                            $rootScope.ubicacion = ubicacion;
                            $rootScope.ubicacionConCoordenada = ubicacionConCoordenada;



                        });


                
            });
        });