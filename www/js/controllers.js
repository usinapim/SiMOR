angular.module('app.controllers', [])

        .controller('cameraTabDefaultPageCtrl', function ($scope) {


        })

        .controller('cartTabDefaultPageCtrl', function ($scope, $rootScope, $filter) {
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
                yAxis: {
                    min: 0,
                    max: 20,
                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',
                    tickPixelInterval: 30,
                    tickWidth: 2,
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
                            from: 0,
                            to: 10,
                            color: '#0082FF' // green
//                            color: '#55BF3B' // green
                        }, {
                            from: 10,
                            to: 15,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: 15,
                            to: 20,
                            color: '#DF5353' // red
                        }]
                },
                series: [{
                        name: 'Speed',
                        data: [0],
                        dataLabels: {
                            formatter: function () {
                                var kmh = this.y;
                                return '<span style="color:#339">' + kmh + ' mts</span><br/>';
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
                    }],
                loading: false
            };

            $scope.puerto = '';
            $scope.puertoSelect = {};

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
                console.log($scope.puertoSelected.ultimo_registro);
                $scope.chartConfig.series = [{
                        name: 'Altura del río',
                        data: [parseFloat($scope.puertoSelected.ultimo_registro)],
                        dataLabels: {
                            formatter: function () {
                                var kmh = this.y;
                                return '<span style="color:#339">' + kmh + ' mts</span><br/>';
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

                $scope.chartConfig.yAxis.plotBands = [{
                        from: 0,
                        to: $scope.puertoSelected.alerta,
//                            color: '#55BF3B' // green
                        color: '#0082FF' // green
                    }, {
                        from: $scope.puertoSelected.alerta,
                        to: $scope.puertoSelected.evacuacion,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: $scope.puertoSelected.evacuacion,
                        to: 20,
                        color: '#DF5353' // red
                    }];




                // print out the selected item
                //console.log(callback.item);

                // print out the component id
                //console.log(callback.componentId);

                // print out the selected items if the multiple select flag is set to true and multiple elements are selected
                //console.log(callback.selectedItems);
            };

        })

        .controller('cloudTabDefaultPageCtrl', function ($scope) {

        })
       