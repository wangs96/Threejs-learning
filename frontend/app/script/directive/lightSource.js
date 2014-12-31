'use strict';

angular.module('three')
  .directive('lightSource', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        renderer.setClearColor(0xEEEEEE, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = -10;
        sphere.position.y = 8;
        sphere.position.z = 0;
        sphere.castShadow = true;

        scene.add(sphere);

        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0x827474});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.position.y = -10;

        plane.rotation.x = -0.5 * Math.PI;

        plane.receiveShadow = true;

        scene.add(plane);

        var ambientLight = new THREE.AmbientLight(0x0c0c0c);

        scene.add(ambientLight);

        var pointLight = new THREE.PointLight(0xccffcc);
        pointLight.position.set(0, 0, 10);

        pointLight.distance = 100;
        pointLight.intensity = 2.4;

        scene.add(pointLight);

        var spotLight = new THREE.SpotLight(0xccffee);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        spotLight.target = plane;

        scene.add(spotLight);

        var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
        hemiLight.position.set(0, 500, 0);

        scene.add(hemiLight);

        element.append(renderer.domElement);

        renderer.render(scene, camera);
      }
    }
  });
