// Init App
var myApp = new Framework7({
    modalTitle: 'SiMOR',
    // Enable Material theme
    material: true,
    // If it is webapp, we can enable hash navigation:
    pushState: true,
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
});
// Add another view, which is in right panel
//var rightView = myApp.addView('.view-right', {
//});

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});




myApp.onPageInit('about', function (page) {
//    $$(page.container).find('.content-block').append('')
    $$.get("terminos.html", function (data) {
        $$(page.container).find('.content-block').html(data);
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

//var color = {
//    value: 1,
//    color: colorGris,
//    highlight: colorGris
//};
//
//data.push(color);
//$$("#grafico").html('');
//
//    var ctx = document.getElementById("grafico").getContext("2d");
//
//
//        if (myDoughnutChart)
//            myDoughnutChart.destroy();
//    
//     myDoughnutChart = new Chart(ctx).Doughnut(data, {
//        responsive: false,
//        tooltipTemplate: "<%if (label){%><%=label%> <%}%>",
//        percentageInnerCutout: 65,
//        segmentStrokeColor: "rgba(255, 255, 255, 0)",
//         animation : false, 
//        
//
//    });


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
$$.ajax({
    url: 'http://fundacionpim.com.ar/simor_web_service/api/niveles.json',
    //url: 'http://192.168.56.101/SiMOR-backend/web/app_dev.php/api/niveles.json',
    dataType: 'json',
    async: false,
    success: function (data) {
        $$.each(data.puertos, function (id, dato) {
//            console.log(dato);
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

console.log(datos);

$$.ajax({
    url: 'http://fundacionpim.com.ar/simor_web_service/api/tips.json',
//    url: 'http://192.168.56.101/SiMOR-backend/web/app_dev.php/api/tips.json',
    dataType: 'json',
    async: false,
    success: function (data) {
        $$.each(data.tips, function (id, dato) {
            tips.push(dato);
            $$('.swiper-wrapper').append('<div class="swiper-slide"><span>' + dato.descripcion + '</span></div>')

        });

    }
});

// Init slider and store its instance in mySwiper variable
var mySwiper = myApp.swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    direction: 'vertical'
});

console.log(tips);

var pickerUbicacion = myApp.picker({
    toolbarCloseText: 'OK',
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

function exitApp (){
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
var onSuccess = function (position) {

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
    
    pickerUbicacion.open()
    pickerUbicacion.setValue([puerto]);
    pickerUbicacion.close()

//    myApp.alert('Latitude: ' + position.coords.latitude + '\n' +
//            'Longitude: ' + position.coords.longitude + '\n' +
//            'Altitude: ' + position.coords.altitude + '\n' +
//            'Accuracy: ' + position.coords.accuracy + '\n' +
//            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
//            'Heading: ' + position.coords.heading + '\n' +
//            'Speed: ' + position.coords.speed + '\n' +
//            'Timestamp: ' + position.timestamp + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    myApp.alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);


