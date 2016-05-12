// Init App
var myApp = new Framework7({
    modalTitle: 'SiMOR',
    // Enable Material theme
    material: true,
    // If it is webapp, we can enable hash navigation:
    pushState: true,
    modalButtonCancel: 'Ahora no',
    modalButtonOk: 'Si',
    swipePanel: 'left',
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {});
// Add another view, which is in right panel
//var rightView = myApp.addView('.view-right', {
//});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', onDeviceReady);

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});


//Funcion Salir
function exitApp() {
    navigator.app && navigator.app.exitApp && navigator.app.exitApp();
}

myApp.onPageInit('about', function (page) {

//    $$(page.container).find('.content-block').append('')
    $$.get("terminos.html", function (data) {
        $$(page.container).find('.content-block').html(data);
    });
});

// FileStorage

function createFile(nombreArchivo) {
    var type = window.TEMPORARY;
    var size = 5 * 1024 * 1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {
        fs.root.getFile(nombreArchivo, {create: true, exclusive: true}, function (fileEntry) {
            // myApp.alert('File creation successfull!')
        }, errorCallback);
    }

    function errorCallback(error) {
        myApp.alert("ERROR: " + error.code)
    }

}

function writeFile(nombreArchivo, datosFile) {
    var type = window.TEMPORARY;
    var size = 5 * 1024 * 1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {

        fs.root.getFile(nombreArchivo, {}, function (fileEntry) {

            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    // alert('Write completed.');
                    console.log('ok');
                };

                fileWriter.onerror = function (e) {
                    alert('Write failed: ' + e.toString());
                };

                var blob = new Blob([datosFile], {type: 'application/json'});
                fileWriter.write(blob);
            }, errorCallback);

        }, errorCallback);

    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}

function readFile(nombreArchivo) {
    var type = window.TEMPORARY;
    var size = 5 * 1024 * 1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {

        fs.root.getFile(nombreArchivo, {}, function (fileEntry) {

            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {

                    // var txtArea = document.getElementById('textarea');
                    // txtArea.value = this.result;
                };

                reader.readAsText(file);

            }, errorCallback);

        }, errorCallback);
    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}

myApp.onPageInit('notificaciones', function (page) {
    $$.ajax({
        url: 'http://fundacionpim.com.ar/simor_web_service/api/tips.json',
        dataType: 'json',
        async: false,
        success: function (data) {


            $$.each(data.tips, function (id, dato) {
                tips.push(dato);
                $$('.swiper-wrapper').append('<div class="swiper-slide"><span>' + dato.descripcion + '</span></div>')

            });

            var mySwiper = myApp.swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                direction: 'vertical'
            });


        }
    });
});


/* ===== Change statusbar bg when panel opened/closed ===== */
$$('.panel-left').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-left');
});
//$$('.panel-right').on('open', function () {
//    $$('.statusbar-overlay').addClass('with-panel-right');
//});
$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});


colorAzul = "#0082FF";
colorVerde = "#009688";
colorAmarillo = "#FFC870";
colorRojo = "#FF5A5E";
colorActual = "#000";
colorGris = "#EEEEEE";
var myDoughnutChart = false;

var data = new Array();

var anchoPantalla = screen.width;
var anchoImagen = anchoPantalla - 32;

if (anchoImagen > 300) {
    anchoImagen = 300;
}

console.log(anchoImagen);
$$("#grafico").css('background-size', anchoImagen + 'px 300px');

function buscarRioByPuerto(puerto) {
    var retorno = 'rio';
    $$.each(datos, function (i, v) {
        if (v.puerto == puerto) {
            retorno = v.rio;
        }
    });

    return retorno;
}

function buscarMedidaByPuerto(puerto) {
    var retorno = 'rio';
    $$.each(datos, function (i, v) {
        if (v.puerto == puerto) {
            retorno = v;
        }
    });

    var valorAlerta = parseFloat(retorno.alerta.replace(',', '.'));
    var valorEvacuacion = parseFloat(retorno.evacuacion.replace(',', '.'));

    var valorVerde = valorAlerta;
    var valorAmarillo = valorEvacuacion - valorAlerta;
    var valorRojo = (valorEvacuacion * 20) / 100;
    var valorActual = (valorEvacuacion * 1.5) / 100;
    var valor = parseFloat(retorno.ultimo_registro.replace(',', '.'));


    var data = Array();


    var textoColor = '';
    var textoValor = '';
    var textoDescripcion = '';


    var total = valorEvacuacion * 1.15;

    var porcentajeValor = (valor * 100) / total;
    var porcentajeValorAlerta = (valorAlerta * 100) / total;
    var porcentajeValorEvacuacion = (valorEvacuacion * 100) / total;


    //verde
    if (valor < valorAlerta) {

        textoColor = colorAzul;

        var val1 = valorVerde - valor;
        var color = {
            value: porcentajeValor,
            color: colorAzul,
            highlight: colorAzul,
            label: "Estado actual seguro a " + valor + " metros",
        };

        data.push(color);

        var color = {
            value: porcentajeValorAlerta - 1 - porcentajeValor,
            color: colorGris,
            highlight: colorGris,
        };

        data.push(color);

        var color = {
            value: 1,
            color: colorAmarillo,
            highlight: colorAmarillo,
            label: "Estado alerta a partir de los " + valorAlerta + " metros"
        };

        data.push(color);

        var color = {
            value: porcentajeValorEvacuacion - 1 - porcentajeValorAlerta,
            color: colorGris,
            highlight: colorGris,
        };

        data.push(color);

        var color = {
            value: 1,
            color: colorRojo,
            highlight: colorRojo,
            label: "Estado de evacuación a partir de los " + valorEvacuacion + " metros"
        };

        data.push(color);


        var color = {
            value: 100 - porcentajeValorEvacuacion,
            color: colorGris,
            highlight: colorGris,
        };

        data.push(color);


    }

    //amarillo
    if (valor >= valorAlerta && valor < valorEvacuacion) {

        textoColor = colorAmarillo;

        var color = {
            value: porcentajeValorAlerta - 1,
            color: colorAzul,
            highlight: colorAzul,
        };

        data.push(color);


        var color = {
            value: 1,
            color: colorAmarillo,
            highlight: colorAmarillo,
            label: "Estado de alerta a partir de los " + valorAlerta + " metros"
        };

        data.push(color);

        var color = {
            value: porcentajeValor - porcentajeValorAlerta,
            color: colorAzul,
            highlight: colorAzul,
            label: "Estado actual de alerta a " + valor + " metros",
        };

        data.push(color);


        var color = {
            value: porcentajeValorEvacuacion - porcentajeValor - 1,
            color: colorGris,
            highlight: colorGris,
        };

        data.push(color);

        var color = {
            value: 1,
            color: colorRojo,
            highlight: colorRojo,
            label: "Estado de evacuación a partir de los " + valorEvacuacion + " metros"
        };


        data.push(color);


        var color = {
            value: 100 - porcentajeValorEvacuacion,
            color: colorGris,
            highlight: colorGris,
        };

        data.push(color);


    }


    //rojo
    if (valor >= valorEvacuacion) {

        textoColor = colorRojo;

        var color = {
            value: porcentajeValorAlerta - 1,
            color: colorAzul,
            highlight: colorAzul
        };

        data.push(color);


        var color = {
            value: 1,
            color: colorAmarillo,
            highlight: colorAmarillo,
            label: "Estado de alerta a partir de los " + valorAlerta + " metros"
        };

        data.push(color);

        var color = {
            value: porcentajeValorEvacuacion - porcentajeValorAlerta - 1,
            color: colorAzul,
            highlight: colorAzul

        };

        data.push(color);


        var color = {
            value: 1,
            color: colorRojo,
            highlight: colorRojo,
            label: "Estado de evacuación a partir de los " + valorEvacuacion + " metros"
        };


        data.push(color);

        var color = {
            value: porcentajeValor - porcentajeValorEvacuacion,
            color: colorAzul,
            label: "Estado actual de evacuación a " + valor + " metros"

        };

        data.push(color);


        var color = {
            value: 100 - porcentajeValor,
            color: colorGris,
            highlight: colorGris

        };

        data.push(color);


    }


    $$("#grafico").removeClass('hidden');
    $$("#img-circulo").css('display', 'none');
    $$("#grafico").html('');

    var ctx = document.getElementById("grafico").getContext("2d");


    if (myDoughnutChart)
        myDoughnutChart.destroy();

    myDoughnutChart = new Chart(ctx).Doughnut(data, {
        responsive: false,
        tooltipTemplate: "<%if (label){%><%=label%> <%}%>",
        percentageInnerCutout: 65,
        segmentStrokeColor: "rgba(255, 255, 255, 0)",
        //animation : false, 


    });


    textoValor = valor + ' metros';
    textoDescripcion = controlNivel(retorno.variacion);

    textoColor = controlNivelColor(retorno.variacion);

    $$("#valor-rio").html(textoValor);
    $$("#descripcion-rio").html(textoDescripcion).css("color", textoColor);
    $$("#valor-alerta").html(valorAlerta + ' mt <br> alerta');
    $$("#valor-evacuacion").html(valorEvacuacion + ' mt <br> evacuac.');

    return retorno;
}

function controlNivel(variacion) {
    variacion = parseFloat(variacion.replace(',', '.'));

    var texto = '';
    if (variacion == 0) {
        texto = '0 mts =';
    }

    if (variacion > 0) {
        texto = variacion + ' mts ▲';
    }

    if (variacion < 0) {
        texto = variacion + ' mts ▼';
    }

    return texto;
}


function controlNivelColor(variacion) {
    variacion = parseFloat(variacion.replace(',', '.'));

    var color = '#FFF';

    if (variacion > 0) {
        color = colorRojo;
    }

    if (variacion < 0) {
        color = colorVerde;
    }

    if (variacion == 0) {
        color = colorAzul;
    }

    return color;
}

//cuando inicializa la app
var ubicacion = new Array();
var datos = new Array();
var tips = new Array();
var ubicacionConCoordenada = new Array();
var datosNiveles = "";
myApp.getNiveles = function (callback) {

    $$.ajax({
        url: 'http://fundacionpim.com.ar/simor_web_service/api/niveles.json',
        dataType: 'json',
        async: false,
        success: function (data) {
            $$.each(data.puertos, function (id, dato) {
//            console.log(dato);
                datosNiveles = dato;
                if (dato.evacuacion != '-' && dato.puerto != 'undefined') {
                    datos.push(dato);

                    ubicacion.push(dato.puerto);
                    if (dato.latitud != undefined && dato.longitud != undefined) {
                        ubicacionConCoordenada.push(dato)
                    }
                }

            });

            ubicacion.sort();
        }
    });
    if (callback) callback();
}
console.log(datos);

$$.ajax({
    url: 'http://fundacionpim.com.ar/simor_web_service/api/tips.json',
    dataType: 'json',
    async: false,
    success: function (data) {
        console.log(data.tips.length);
        if (data.tips.length > 0) {
            myApp.confirm('Tenés notificaciones. Querés verlas?', 'Notificaciones y tips', function () {
                mainView.router.loadPage('notificaciones.html');
            });
        }


    }
});

// Autocomplete
// set ubicacion para autocomplete
function setUbicacion(puerto) {
    $$('#autocomplete-standalone').find('.item-after').text(puerto);
    // Add item value to input value
    $$('#autocomplete-standalone').find('input').val(puerto);

    // myApp.alert(value);
    $$('#nombre-rio').html(buscarRioByPuerto(puerto));
    buscarMedidaByPuerto(puerto);
}

var autocompleteDropdownAll = myApp.autocomplete({

    openIn: 'page', //open in page
    opener: $$('#autocomplete-standalone'), //link that opens autocomplete
    backOnSelect: true,
    searchbarPlaceholderText: 'Buscar...',
    notFoundText: 'No se encontraron lugares',
    source: function (autocomplete, query, render) {

        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        // Find matched items
        for (var i = 0; i < ubicacion.length; i++) {
            if (ubicacion[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(ubicacion[i]);
        }
        // Render items by passing array with result items
        render(results);
    },
    onOpen: function (autocomplete) {
        $$('.autocomplete-title').html('');
    },
    onChange: function (autocomplete, value) {

        setUbicacion(value);

        // $$('#autocomplete-standalone').find('.item-after').text(value[0]);
        // // Add item value to input value
        // $$('#autocomplete-standalone').find('input').val(value[0]);
        //
        // // myApp.alert(value);
        // $$('#nombre-rio').html(buscarRioByPuerto(value));
        // buscarMedidaByPuerto(value);

    }
});
// Ubicacion Picker
var pickerUbicacion = myApp.picker({
    toolbarCloseText: 'Ver datos',
    input: '#ks-picker-ubicacion',
    cols: [
        {
            textAlign: 'center',
            values: ubicacion,
            onClose: function (picker, ubicacionSel) {
                myApp.alert(ubicacionSel);
            }
        }
    ],
    onClose: function (picker) {
//        console.log(picker);    

        $$('#nombre-rio').html(buscarRioByPuerto(picker.value));
        buscarMedidaByPuerto(picker.value);
    }
});

/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

function exitApp() {
    navigator.app.exitApp();
}

function getDistance(lat1, lon1, lat2, lon2) {
//    posadas
//    var lat2 = -27.351837;
//    var lon2 = -55.899124;
//    caxia
//    var lat2 = -25.559915;
//    var lon2 = -53.107878;

    // Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness 2002-2011                   - www.movable-type.co.uk/scripts/latlong.html
// where R is earth’s radius (mean radius = 6,371km);
// note that angles need to be in radians to pass to trig functions!
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

//geolocalizacion
var onSuccessGeo = function (position) {

    var lat1 = position.coords.latitude;
    var lon1 = position.coords.longitude;

    var distancia = Number.MAX_VALUE;
    var puerto = null;

    $$.each(ubicacionConCoordenada, function (id, dato) {
        var distanciaCal = getDistance(lat1, lon1, parseFloat(dato.latitud), parseFloat(dato.longitud));

        if (distanciaCal < distancia) {
            distancia = distanciaCal;
            puerto = dato.puerto;
        }

    });
    console.log(puerto);

    // pickerUbicacion.open()
    // pickerUbicacion.setValue([puerto]);
    // pickerUbicacion.close()

    setUbicacion(puerto);

};

// onError Callback receives a PositionError object
//
function onError(error) {
    myApp.alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccessGeo, onError);


//location
function onDeviceReady() {

    $$('body').addClass(device.platform.toLowerCase());

    myApp.getNiveles();

    // createFile('niveles.txt');

    // writeFile('niveles.txt', JSON.stringify(datosNiveles));

    // Bind events
    $$(document).on("resume", onResume);

    // Register change listeners for iOS
    if (device.platform === "iOS") {
        cordova.plugins.diagnostic.registerLocationAuthorizationStatusChangeHandler(function (status) {
            console.log("Location authorization status changed to: " + status);
            // checkState();
        });
    }

    // iOS settings

    $$('#request-location-always').on("click", function () {
        cordova.plugins.diagnostic.requestLocationAuthorization(function () {
            console.log("Successfully requested location authorization always");
        }, function (error) {
            console.error(error);
        }, "always");
    });

    $$('#request-location-in-use').on("click", function () {
        cordova.plugins.diagnostic.requestLocationAuthorization(function () {
            console.log("Successfully requested location authorization when in use");
        }, function (error) {
            console.error(error);
        }, "when_in_use");
    });

    // Android settings
    $$('#location-settings').on("click", function () {
        cordova.plugins.diagnostic.switchToLocationSettings();
    });

    $$('#mobile-data-settings').on("click", function () {
        cordova.plugins.diagnostic.switchToMobileDataSettings();
    });

    $$('#get-location').on("click", function () {
        var posOptions = {timeout: 35000, enableHighAccuracy: true, maximumAge: 5000};
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            alert("Current position: " + lat + "," + lon);
        }, function (err) {
            console.error("Position error: code=" + err.code + "; message=" + err.message);
            alert("Position error\ncode=" + err.code + "\nmessage=" + err.message);
        }, posOptions);
    });

    // Notification
    var push = PushNotification.init({
        "android": {"senderID": "835325767417"},
        "ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {}
    });

    push.on('registration', function (data) {
        console.log(data.registrationId);
        var regId = data.registrationId;
        // susbcribir el equipo
        $$.ajax({
            // url: 'http://fundacionpim.com.ar/simor_web_service/api/susbcribe.json',
            url: 'http://fundacionpim.com.ar/simor_web_service/api/susbcribe.json',
            dataType: 'json',
            method: 'POST',
            async: false,
            data: {deviceId: regId},
            success: function (data) {

                console.log('subscripto correctamente');

            }
        });

    });

    push.on('notification', function (data) {
        console.log(data.message);
// data.title,
// data.count,
// data.sound,
// data.image,
// data.additionalData
    });


    push.on('error', function (e) {
        myApp.alert(e.message)
        console.log(e.message);
    });

    setTimeout(checkState, 500);
}


function checkState() {
    console.log("Checking state...");

    $$('#state li').removeClass('on off');

    // Location
    cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
        $$('#nombre-rio').addClass(enabled ? 'on' : 'off');
        if (!enabled) {
            myApp.confirm('Si querés seleccionar el puerto mas cercarno, activa la ubicación', 'Ubicacion', function () {
                cordova.plugins.diagnostic.switchToLocationSettings();
                navigator.geolocation.getCurrentPosition(onSuccessGeo, onError);
            });

        }
    }, onError);

    if (device.platform === "iOS") {
        cordova.plugins.diagnostic.isLocationEnabledSetting(function (enabled) {
            $$('#state .location-setting').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.isLocationAuthorized(function (enabled) {
            $$('#state .location-authorization').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.getLocationAuthorizationStatus(function (status) {
            $$('#state .location-authorization-status').find('.value').text(status.toUpperCase());
            $$('.request-location').toggle(status === "not_determined");
        }, onError);
    }

    if (device.platform === "Android") {
        cordova.plugins.diagnostic.isGpsLocationEnabled(function (enabled) {
            $$('#state .gps-location').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.isNetworkLocationEnabled(function (enabled) {
            $$('#state .network-location').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.getLocationMode(function (mode) {
            $$('#state .location-mode').find('.value').text(mode.toUpperCase());
        }, onError);
    }
}

function onResume() {
    checkState();
}


// $$(document).on("deviceready", onDeviceReady, false);