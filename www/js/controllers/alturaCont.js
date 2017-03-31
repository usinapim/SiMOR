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
                plotBackgroundColor: colorPrincipal,
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
        yAxis: {
            min: 0,
            max: 200,
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
                id: 'normal',
                from: 0,
                to: 100,
                color: colorNormal
//                            color: '#55BF3B' // green
            }, {
                id: 'alerta',
                from: 100,
                to: 150,
                color: colorAlerta
                //color: '#DDDF0D'  yellow
            }, {
                id: 'evacuacion',
                from: 150,
                to: 200,
                color: colorEvacuacion
                //color: '#DF5353'  red
            }]
        },
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

        var max = 20;
        var alerta = 10;
        var evacuacion = 15;

        if (!isUndefined($scope.puertoSelected)) {
            if ($scope.puertoSelected.evacuacion && parseFloat($scope.puertoSelected.evacuacion) > 0) {
                max = parseFloat($scope.puertoSelected.evacuacion) * 1.2;
                evacuacion = parseFloat($scope.puertoSelected.evacuacion);
            }

            if ($scope.puertoSelected.alerta && parseFloat($scope.puertoSelected.alerta) > 0) {
                alerta = parseFloat($scope.puertoSelected.alerta);
            }

        }

        var chart = $scope.chartConfig.getHighcharts();

        chart.yAxis[0].removePlotBand('normal');
        chart.yAxis[0].removePlotBand('alerta');
        chart.yAxis[0].removePlotBand('evacuacion');

        chart.yAxis[0].setExtremes(0, max)

        chart.yAxis[0].addPlotBand(
            {id: "normal", from: 0, to: alerta, color: colorNormal}
        );
        chart.yAxis[0].addPlotBand(
            {id: "alerta", from: alerta, to: evacuacion, color: colorAlerta}
        );
        chart.yAxis[0].addPlotBand(
            {id: "evacuacion", from: evacuacion, to: max, color: colorEvacuacion}
        );

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
                return '<span style="color:#fff">' + mts + ' mts</span><br/>';
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