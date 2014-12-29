'use strict';

angular.module('three')
  .factory('addNewObject', function () {
    return {
      addNewCube: addNewCube
    };

    function addNewCube() {
      var cubeSize = Math.ceil((Math.random() * 3));
      var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      cube.position.x = -30 + Math.round((Math.random() * 40));
      cube.position.y = Math.round(Math.random() * 5);
      cube.position.z = -20 + Math.round(Math.random() * 60);

      return cube;
    }
  });
