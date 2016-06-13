// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js



var app = angular.module('app', ['ionic', 'highcharts-ng', 'app.routes', 'app.controllers',  'app.services', 'app.directives', 'ion-autocomplete', 'blockUI'])

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

                $rootScope.showToast = function (texto) {
                    window.plugins.toast.showWithOptions(
                            {
                                message: texto,
                                duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself. 
                                position: "bottom",
                                addPixelsY: -40  // added a negative value to move it up a bit (default 0) 
                            }

                    );
                };

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
                            console.log(ubicacionConCoordenada);
                        });



            });
        });



/*Funciones globales*/



function isUndefined(data) {
    return (typeof data === 'undefined');
}