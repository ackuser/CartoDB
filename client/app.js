'use strict';
angular
.module('cartoDB', [])
.controller('MyController', ['$scope', '$sce', 'APIService', function($scope, $sce, APIService) {
    $scope.renderGraph = function() {
      APIService.getDataSet().then(function(data) {
          // $scope.graph = $sce.trustAsHtml(data)
          // console.log($scope.graph)
        });
    };
  }])
.service('APIService', function($http) {
  var url = 'https://localhost:3000/data';

  function getDataSet() {
        return $http.get(url)
        .then(function(response) {
          // console.log(response)
          return response.data;
        });
      };

    return {
      getDataSet: getDataSet
    };

  });
