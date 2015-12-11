// Init App
var myApp = new Framework7({
    modalTitle: 'SiMOR',
    // Enable Material theme
    material: true,
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

//cuando inicializa la app
var ubicacion = new Array();
var datos = new Array();
$$.ajax({
    url: 'http://179.43.125.144/simor_web_service/index.php/welcome/get_niveles',
    dataType: 'json',
    async: false,
    success: function (data) {
        $$.each(data.puertos, function (id, dato) {
//            console.log(dato);
            if (dato.evacuacion != '-' && dato.puerto != 'undefined') {
                datos.push(dato);
                
                ubicacion.push(dato.puerto);
            }

        });
        
        ubicacion.sort();
    }
});

console.log(datos);
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


colorVerde = "#5AD3D1";
colorAmarillo = "#FFC870";
colorRojo = "#FF5A5E";
colorActual = "#000";


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
    var valor = parseFloat(retorno ['ult. registro'].replace(',', '.'));
    
    
    var data = Array();
    
    
    var textoColor = '';
    var textoValor = '';
    var textoDescripcion = '';


    //verde
    if (valor < valorAlerta) {
        
        textoColor = colorVerde;
        
        var val1 = valorVerde - valor;
        var color = {
            value: valor,
            color: colorVerde,
            highlight: colorVerde,
            label: "Estado seguro de 0 a " + retorno.alerta+ " metros"
        };
        
        data.push(color);
        
        var color = {
            value: valorActual,
            color: colorActual,
            highlight: colorActual,
            label: "Estado actual seguro a " + valor+ " metros"
        };
        
        data.push(color);
        
       var color = {
            value: val1,
            color: colorVerde,
            highlight: colorVerde,
            label: "Estado seguro de 0 a " + retorno.alerta+ " metros"
        };
        
        data.push(color);
        
        
    }else{
        var color = {
            value: valorVerde,
            color: colorVerde,
            highlight: colorVerde,
            label: "Estado seguro de 0 a " + retorno.alerta+ " metros"
        };
        
        data.push(color);
    }


    //amarillo
    if (valor >= valorAlerta && valor < valorEvacuacion) {
        textoColor = colorAmarillo;
        
        var val1 = valorEvacuacion - valor;
        var val2 = valor - valorAlerta;
        var color = {
            value: val2,
            color: colorAmarillo,
            highlight: colorAmarillo,
            label: "Estado alerta " + retorno.alerta + " a " + retorno.evacuacion+ " metros"
        };
        
        data.push(color);
        
        var color = {
            value: valorActual,
            color: colorActual,
            highlight: colorActual,
            label: "Estado actual de alerta a " +valor+ " metros"
        };
        
        data.push(color);
        
       var color = {
            value: val1,
            color: colorAmarillo,
            highlight: colorAmarillo,
            label: "Estado alerta " + retorno.alerta + " a " + retorno.evacuacion+ " metros"
        };
        
        data.push(color);
    }else{
        
         var color ={
            value: valorAmarillo,
            highlight: colorAmarillo,
            color: colorAmarillo,
            label: "Estado alerta " + retorno.alerta + " a " + retorno.evacuacion+ " metros"
        };
        data.push(color);
    }

    //rojo
    if (valor >= valorEvacuacion) {
        textoColor = colorRojo;
        var val1 = valorEvacuacion + valorRojo  - valor;
        var val2 = valor  - valorEvacuacion;
        
        var color = {
            value: val2,
            color: colorRojo,
            highlight: colorRojo,
            label: "Estado evacuación de 0 a " + retorno.alerta+ " metros"
        };
        
        data.push(color);
        
        var color = {
            value: valorActual,
            color: colorActual,
            highlight: colorActual,
            label: "Estado actual evacuación " + valor+ " metros"
        };
        
        data.push(color);
        
       var color = {
            value: val1,
            color: colorRojo,
            highlight: colorRojo,
            label: "Estado evacuación de 0 a " + retorno.alerta+ " metros"
        };
        
        data.push(color);
    }else{
        var color = {
            value: valorRojo,
            highlight: colorRojo,
            color: colorRojo,
            label: "Estado evacuación de " + retorno.evacuacion + " metros ",
            
        };
        data.push(color);
    }



//
//    var data = [
//        {
//            value: valorVerde,
//            color: "#5AD3D1",
//            highlight: "#5AD3D1",
//            label: "Estado seguro de 0 a " + retorno.alerta+ " metros"
//        },
//        {
//            value: valorAmarillo,
//            highlight: "#FFC870",
//            color: "#FFC870",
//            label: "Estado alerta " + retorno.alerta + " a " + retorno.evacuacion+ " metros"
//        },
//        {
//            value: valorRojo,
//            highlight: "#FF5A5E",
//            color: "#FF5A5E",
//            label: "Estado evacuación de " + retorno.evacuacion + " metros "
//        }
//
//    ];




    var ctx = document.getElementById("grafico").getContext("2d");
    
   

    var myDoughnutChart = new Chart(ctx).Doughnut(data, {
        responsive: true,
        tooltipTemplate: "<%if (label){%><%=label%> <%}%>",
        
    });
    
    


    


    



    textoValor = valor + ' metros';
    textoDescripcion = controlNivel(retorno.variacion);

    $$("#valor-rio").html(textoValor).css("color", textoColor);
    $$("#descripcion-rio").html(textoDescripcion);

    return retorno;
}

function controlNivel(variacion) {
    variacion = parseFloat(variacion.replace(',', '.'));

    var texto = '';
    if (variacion == 0) {
        texto = '0 mts =';
    }

    if (variacion > 0) {
        texto = variacion + ' mts ↑';
    }

    if (variacion < 0) {
        texto = variacion + ' mts ↓';
    }

    return texto;
}
