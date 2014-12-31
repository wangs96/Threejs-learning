'use strict';

angular.module('three')
  .directive('lensFlare', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {


        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xaaaaaa, 0.010, 200);

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


        // create a render and set the size
        var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});

        renderer.setClearColor(new THREE.Color(0xaaaaff, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;


        // create the ground plane
        var textureGrass = THREE.ImageUtils.loadTexture("image/grasslight-big.jpg");
        textureGrass.wrapS = THREE.RepeatWrapping;
        textureGrass.wrapT = THREE.RepeatWrapping;
        textureGrass.repeat.set(4, 4);


        var planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({map: textureGrass});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // position the cube
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        // add the cube to the scene
        scene.add(cube);

        var sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
        sphere.position.x = 10;
        sphere.position.y = 5;
        sphere.position.z = 10;
        sphere.castShadow = true;

        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.x = -20;
        camera.position.y = 15;
        camera.position.z = 45;
        camera.lookAt(new THREE.Vector3(10, 0, 0));

        // add subtle ambient lighting
        var ambiColor = "#1c1c1c";
        var ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);

        // add spotlight for a bit of light
        var spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 60, -10);
        spotLight0.lookAt(plane);
        scene.add(spotLight0);


        var target = new THREE.Object3D();
        target.position.set(5, 0, 0);


        var pointColor = "#ffffff";
//    var spotLight = new THREE.SpotLight( pointColor);
        var spotLight = new THREE.DirectionalLight(pointColor);
        spotLight.position.set(30, 10, -50);
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 0.1;
        spotLight.shadowCameraFar = 100;
        spotLight.shadowCameraFov = 50;
        spotLight.target = plane;
        spotLight.distance = 0;
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 200;
        spotLight.shadowCameraLeft = -100;
        spotLight.shadowCameraRight = 100;
        spotLight.shadowCameraTop = 100;
        spotLight.shadowCameraBottom = -100;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;


        scene.add(spotLight);


        // add the output of the renderer to the html element
        element.append(renderer.domElement);

        // call the render function
        var step = 0;


        var textureFlare0 = THREE.ImageUtils.loadTexture("image/lensflare0.png");
        var textureFlare3 = THREE.ImageUtils.loadTexture("image/lensflare3.png");

        var flareColor = new THREE.Color(0xffaacc);
        var lensFlare = new THREE.LensFlare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);

        lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

        lensFlare.position.copy(spotLight.position);
        scene.add(lensFlare);

        render();

        function render() {

          // rotate the cube around its axes
          cube.rotation.x += 0.04;
          cube.rotation.y += 0.04;
          cube.rotation.z += 0.04;

          // bounce the sphere up and down
          step += 0.04;
          sphere.position.x = 20 + ( 10 * (Math.cos(step)));
          sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

          requestAnimationFrame(render);
          renderer.render(scene, camera);
        }

      }
    }
  });
