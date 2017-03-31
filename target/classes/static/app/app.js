'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.login',
  'services.factory',
  'myApp.version'
]).
config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {
$routeProvider.otherwise({redirectTo: '/login'});
$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}])

.controller('LogOut',['$rootScope','$scope','$http','$location',function($rootScope, $scope, $http ,$location){

    $scope.logout = function () {
                    $http.post('/logout', {}).success(function () {
                        $rootScope.authenticated = false;
                        $location.path("/");
                    }).error(function (data) {
                        $rootScope.authenticated = false;
                    });
                };
}]);
