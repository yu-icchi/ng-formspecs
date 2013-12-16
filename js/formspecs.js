
// FormSpecs Module
var formSpecs = angular.module('formSpecs', []);

// FactoryService
formSpecs.factory('httpService', function($http) {

});

// Controller
formSpecs.controller('FormSpecs', ['$scope', function($scope) {

    $scope.test = 'FormSpaces';

    $scope.save = function() {
        alert($scope.id);
    };

}]);

// Application
var app = angular.module('app', ['formSpecs']);



