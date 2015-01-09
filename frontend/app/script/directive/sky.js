'use strict';

angular.module('three')
  .directive('sky', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var container = element[0];
        window.render3d.init({text:"404! Empty Here!",container:container});
      }
    }
  });






