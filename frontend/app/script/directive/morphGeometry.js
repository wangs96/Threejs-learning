'use strict';

angular.module('three')
  .directive('morphGeometry', function () {
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

        var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 10;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.receiveShadow = true;

        scene.add(plane);

        var ambientLight = new THREE.AmbientLight(0x0c0c0c);

        scene.add(ambientLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;

        scene.add(spotLight);

        var vertices = [
          new THREE.Vector3(10, 10, 10),
          new THREE.Vector3(10, 10, -10),
          new THREE.Vector3(10, -10, 10),
          new THREE.Vector3(10, -10, -10),
          new THREE.Vector3(-10, 10, -10),
          new THREE.Vector3(-10, 10, 10),
          new THREE.Vector3(-10, -10, -10),
          new THREE.Vector3(-10, -10, 10)
        ];

        var faces = [
          new THREE.Face3(0, 2, 1),
          new THREE.Face3(2, 3, 1),
          new THREE.Face3(4, 6, 5),
          new THREE.Face3(6, 7, 5),
          new THREE.Face3(4, 5, 1),
          new THREE.Face3(5, 0, 1),
          new THREE.Face3(7, 6, 2),
          new THREE.Face3(6, 3, 2),
          new THREE.Face3(5, 7, 0),
          new THREE.Face3(7, 2, 0),
          new THREE.Face3(1, 3, 4),
          new THREE.Face3(3, 6, 4)
        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.verticesNeedUpdate = true;
        geom.computeFaceNormals();
        geom.mergeVertices();

        var geoMaterials = [ new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.6}),
          new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}) ];

        var geometry = THREE.SceneUtils.createMultiMaterialObject(geom, geoMaterials);
        geometry.position.x = 0;
        geometry.position.y = 15;
        geometry.position.z = 0;
        geometry.children.forEach(function (e) {
          e.castShadow = true;
        });

        scene.add(geometry);

        element.append(renderer.domElement);

        var step = 0;

        animate();

        function animate() {

          var newVertices = [
            new THREE.Vector3(10 + Math.sin(step), 10 + Math.cos(step), 10 + Math.cos(step)),
            new THREE.Vector3(10 + Math.sin(step), 10 + Math.sin(step), -10 + Math.sin(step)),
            new THREE.Vector3(10 + Math.sin(step), -10 + Math.sin(step), 10 + Math.sin(step)),
            new THREE.Vector3(10 + Math.sin(step), -10 + Math.cos(step), -10 + Math.cos(step)),
            new THREE.Vector3(-10 + Math.sin(step), 10 + Math.sin(step), -10 + Math.sin(step)),
            new THREE.Vector3(-10 + Math.cos(step), 10 + Math.sin(step), 10 + Math.sin(step)),
            new THREE.Vector3(-10 + Math.sin(step), -10 + Math.sin(step), -10 + Math.sin(step)),
            new THREE.Vector3(-10 + Math.sin(step), -10 + Math.cos(step), 10)
          ];

          geometry.children.forEach(function (e) {
            e.geometry.vertices = newVertices;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.computeFaceNormals();
          });

          step += 0.04;

          requestAnimationFrame(animate);

          renderer.render(scene, camera);
        }
      }
    }
  });
