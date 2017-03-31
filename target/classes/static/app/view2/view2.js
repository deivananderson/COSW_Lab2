'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'addTarea', function($scope, addTarea) {

    $scope.descripcion;
    $scope.prioridad;

    $scope.guardar = function(){
        //fabrica.addTodo({'descripcion':$scope.descripcion,'prioridad':$scope.prioridad});
        //alert(tareas.query());
        addTarea.save({'descripcion':$scope.descripcion,'prioridad':$scope.prioridad});
    };

}]);