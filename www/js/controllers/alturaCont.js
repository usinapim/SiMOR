app.controller('alturaCont', function ($scope, $rootScope, $filter) {

    $scope.colorAlerta = colorAlerta;
    $scope.colorEvacuacion = colorEvacuacion;
    $scope.colorNormal = colorNormal;
    $scope.puerto = '';
    $scope.puertoSelect = {};
    $scope.variacion = {};

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                        backgroundColor: {
                            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
            },
        },
        title: 'Medidor de alturas',
        yAxis: getYAxes(),
        series: getSeries(),
        loading: false
    };


    $scope.getTestItems = function (query) {
        if (query) {
            return {
                items: $filter('filter')($rootScope.puertos, query)
            };
        }
        return {items: $rootScope.puertos};
    };

    $scope.clickedMethod = function (callback) {
        $scope.puertoSelected = callback.item;

        $scope.chartConfig.series = getSeries($scope.puertoSelected.ultimo_registro);

        $scope.chartConfig.yAxis = getYAxes($scope.puertoSelected);
        
        $scope.variacion = getVariacion($scope.puertoSelected.variacion);


        // print out the selected item
        //console.log(callback.item);

        // print out the component id
        //console.log(callback.componentId);

        // print out the selected items if the multiple select flag is set to true and multiple elements are selected
        //console.log(callback.selectedItems);
    };



});

function getSeries(data) {
    if (isUndefined(data)) {
        data = 0;
    }
    var series = [{
            name: 'Altura del río',
            data: [parseFloat(data)],
            dataLabels: {
                formatter: function () {
                    var mts = this.y;
                    return '<span style="color:#000">' + mts + ' mts</span><br/>';
                },
                backgroundColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#DDD'],
                        [1, '#FFF']
                    ]
                }
            },
            tooltip: {
                valueSuffix: ' mts'
            }
        }];

    return series;
}

function getYAxes(unPuerto) {
    var min = 0;
    var max = 20;
    var alerta = 10;
    var evacuacion = 15;
    if (!isUndefined(unPuerto)) {
        if (unPuerto.evacuacion && parseFloat(unPuerto.evacuacion) > 0) {
            max = parseFloat(unPuerto.evacuacion) * 1.2;
            evacuacion = parseFloat(unPuerto.evacuacion);
        }

        if (unPuerto.alerta && parseFloat(unPuerto.alerta) > 0) {
            alerta = parseFloat(unPuerto.alerta);
        }

    }
    var axes = {
        min: min,
        max: max,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 30,
        tickWidth: 1,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: 'mts'
        },
        plotBands: [{
                from: min,
                to: alerta,
                color: colorNormal
//                            color: '#55BF3B' // green
            }, {
                from: alerta,
                to: evacuacion,
                color: colorAlerta
                        //color: '#DDDF0D'  yellow
            }, {
                from: evacuacion,
                to: max,
                color: colorEvacuacion
                        //color: '#DF5353'  red
            }]
    };

    return axes;
}

function getVariacion(variacion) {
    variacion = parseFloat(variacion);
    var retorno = {};
    if (variacion == 0) {
        retorno = {
            variacion: variacion,
            icono: 'icon ion-checkmark',
            color: colorNormal
        };
    } else if (variacion > 0) {
        retorno = {
            variacion: variacion,
            icono: 'icon ion-arrow-up-a',
            color: colorEvacuacion
        };

    } else if (variacion < 0) {
        retorno = {
            variacion: variacion,
            icono: 'icon ion-arrow-down-a',
            color: colorBajaNivel
        };
    }
    
    return retorno;
}