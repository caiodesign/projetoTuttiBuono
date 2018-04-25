angular.module('app').controller('ProdutoController', ['$scope', '$timeout', '$http',function ($scope, $timeout, $http) {

    // GET JSON 'doencasRelacionadas'
    $http.get("/assets/json/sabor.json")
    .then(function(response) {
        $scope.sabor = response.data;
    }, function(response) {
        console.log("Algum erro inesperado ocorreu. Arquivo: /assets/json/doencasRelacionadas.json");
    });

    $scope.onlyShow = 6;

    // function to show and hide 'card-modal's
    $scope.showModal = function (INDEX, NODE) {
        for(var i = 0; i < NODE.length; i++){
            if(NODE[i].show == true){
                NODE[i].show = false;
            }
        }
        if(INDEX){
            INDEX.show = true;
        }
    }

    $scope.isMultiple = function (id, multiple){
        if( id % multiple == 0){
            return true;
        } else {
            return false;
        }
    }

    $('.sizeup-button').on('click', function(){
        $('.flex-side div').removeClass('sizeup');
        $('.size .sizeup-button').removeClass('suma');
        $(this).parent().parent().addClass("sizeup");
        $(this).addClass('suma');
    })
}])