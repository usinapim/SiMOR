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
            datos.push(dato);
            ubicacion.push(dato.puerto);
        })
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
                myApp.alert(ubicacionSel)
            }
        }
    ],
    onClose: function (picker) {
//        console.log(picker);    

        $$('#nombre-rio').html(picker.value);
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


