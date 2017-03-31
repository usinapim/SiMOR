app.controller('mapaCont', function ($scope, $rootScope, $http, $compile) {

    $scope.initMap = function (myLatLng) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: myLatLng
        });


//        $scope.busqueda.mapa = true;
        angular.forEach($rootScope.ubicacionConCoordenada, function (puerto, id) {

            var variacion = getVariacion(puerto.variacion);

            var compiled = $compile("<div style='text-align:left;'>" + puerto.rio + '<br><strong>' + puerto.puerto + ' <div style="color: ' + variacion.color + ';"><i class="' + variacion.icono + '"></i> ' + variacion.variacion + ' mts</div>' + ' <div style="color: ' + colorNormal + ';"><i class="icon ion-waterdrop"></i> ' + puerto.ultimo_registro + ' mts</div>' + "</div>")($scope);
            var infowindow = new google.maps.InfoWindow({
                content: compiled[0],
                maxWidth: 200
            });
//            var imageUrl = evento.icono ? categoriaIconosDir + evento.icono : '';
//            var image = {
//                url: imageUrl,
//                size: new google.maps.Size(48, 48),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(17, 34),
//                scaledSize: new google.maps.Size(25, 25)
//            };
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(puerto.latitud), lng: parseFloat(puerto.longitud)},
                map: map,
                title: 'Hello World!',
                animation: google.maps.Animation.DROP,
                //icon: image
            });
            marker.addListener('click', function () {
                infowindow.open(map, marker);
                //agregar abrir ventana del evento
            });
        });
    };

    $scope.initMap({lat: -27.106337, lng: -55.522285});
});