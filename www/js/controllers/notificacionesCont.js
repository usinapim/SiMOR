
app.controller('notificacionesCont', function ($scope, $rootScope, $http, $ionicModal) {
    $scope.tips = [];
    $scope.tip = {};

    $http.get(servidor + "simor_web_service/api/tips.json")
            .success(function (data) {

                var tips = [];
                angular.forEach(data.tips, function (dato, id) {
                    tips.push(dato);

                });

                $scope.tips = tips;

            })
            .error(function () {

            });

    $ionicModal.fromTemplateUrl('templates/notificacionesModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        console.log('asdasd');
    });

    $scope.openModal = function (t) {
        $scope.tip = t;
        $scope.modal.show();
    };
    ;
});