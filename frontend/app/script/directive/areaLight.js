'use strict';

angular.module('three')
  .directive('areaLight', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {

        var camera;

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene.add(camera);


        // create a render and set the size
//        var renderer = new THREE.WebGLRenderer();
        var renderer = new THREE.WebGLDeferredRenderer({
          width: window.innerWidth,
          height: window.innerHeight,
          scale: 1, antialias: true,
          tonemapping: THREE.FilmicOperator, brightness: 2.5,
          alpha: true
        });

//        renderer.setSize(window.innerWidth, window.innerHeight);
//        renderer.shadowMapEnabled = true;

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(70, 70, 1, 1);
        var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 200 });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.receiveShadow  = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // position and point the camera to the center of the scene
        camera.position.x = 20;
        camera.position.y = 30;
        camera.position.z = 21;
        camera.lookAt(new THREE.Vector3(0, 0, -30));

        // add the output of the renderer to the html element
        element.append(renderer.domElement);

        // call the render function
        var step = 0;


        var spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 60, -10);
        spotLight0.intensity = 0.1;
        spotLight0.lookAt(plane);
        scene.add(spotLight0);


        var areaLight1 = new THREE.AreaLight(0xff0000, 3);
        areaLight1.position.set(-10, 10, -35);
        areaLight1.rotation.set(-Math.PI / 2, 0, 0);
        areaLight1.width = 4;
        areaLight1.height = 9.9;
        scene.add(areaLight1);

        var areaLight2 = new THREE.AreaLight(0x00ff00, 3);
        areaLight2.position.set(0, 10, -35);
        areaLight2.rotation.set(-Math.PI / 2, 0, 0);
        areaLight2.width = 4;
        areaLight2.height = 9.9;
        scene.add(areaLight2);

        var areaLight3 = new THREE.AreaLight(0x0000ff, 3);
        areaLight3.position.set(10, 10, -35);
        areaLight3.rotation.set(-Math.PI / 2, 0, 0);
        areaLight3.width = 4;
        areaLight3.height = 9.9;
        scene.add(areaLight3);

        var planeGeometry1 = new THREE.BoxGeometry(4, 10, 0);
        var planeGeometry1Mat = new THREE.MeshBasicMaterial({color: 0xff0000});
        var plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat);
        plane1.position.copy(areaLight1.position);
        scene.add(plane1);


        var planeGeometry2 = new THREE.BoxGeometry(4, 10, 0);
        var planeGeometry2Mat = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var plane2 = new THREE.Mesh(planeGeometry2, planeGeometry2Mat);

        plane2.position.copy(areaLight2.position);
        scene.add(plane2);

        var planeGeometry3 = new THREE.BoxGeometry(4, 10, 0);
        var planeGeometry3Mat = new THREE.MeshBasicMaterial({color: 0x0000ff});
        var plane3 = new THREE.Mesh(planeGeometry3, planeGeometry3Mat);

        plane3.position.copy(areaLight3.position);
        scene.add(plane3);

        renderer.render(scene, camera);

      }
    }
  });
