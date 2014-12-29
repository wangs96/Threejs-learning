'use strict';

angular.module('three')
  .directive('cubeSphere', function (addNewObject) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();

        scene.fog = new THREE.Fog(0xffffff, 0.015, 200);

        renderer.setClearColor(0xEEEEEE, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        //uncomment these lines to see the axes of the scene
//        var axes = new THREE.AxisHelper( 20 );
//        scene.add(axes);

        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.receiveShadow = true;

        scene.add(plane);

        var cubeGeometry =  new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        cube.castShadow = true;

        scene.add(cube);

        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        sphere.castShadow = true;

        scene.add(sphere);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;

        scene.add(spotLight);

        var ambientLight = new THREE.AmbientLight(0x0c0c0c);

        scene.add(ambientLight);

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        element.append(renderer.domElement);
        element.append('<button class="add btn-default">Add Cube</button>');
        element.append('<button class="remove btn-default">Remove Cube</button>');

        var addCube = element.find('button.add');
        var removeCube = element.find('button.remove');


        addCube.on('click', function () {
          var newCube = addNewObject.addNewCube();

          scene.add(newCube);
        });

        removeCube.on('click', function () {
          var allChildren = scene.children;
          var lastObject = allChildren[allChildren.length - 1];

          if (lastObject instanceof THREE.Mesh) {
            scene.remove(lastObject);
          }
        });

        var step = 0;

        renderScene();

        function renderScene() {

          step += 0.04;

          sphere.position.x = 20 + ( 10 * Math.cos(step));
          sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

          cube.rotation.x += 0.02;
          cube.rotation.y += 0.02;
          cube.rotation.z += 0.02;

          requestAnimationFrame( renderScene );
          renderer.render(scene, camera);
        }
      }
    }
  });
