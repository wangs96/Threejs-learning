'use strict';

angular.module('three')
  .directive('particles', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var container;
        var camera, controls, scene, renderer;
        var objects = [], plane;

        var mouse = new THREE.Vector2(),
          offset = new THREE.Vector3(),
          INTERSECTED, SELECTED;

        init();
        animate();

        function init() {

          container = element;

          camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
          camera.position.z = 1000;

          controls = new THREE.OrbitControls( camera );
          controls.rotateSpeed = 1.0;
          controls.zoomSpeed = 1.2;
          controls.panSpeed = 0.8;
          controls.noZoom = false;
          controls.noPan = false;
          controls.staticMoving = true;
          controls.dynamicDampingFactor = 0.3;

          scene = new THREE.Scene();
          scene.fog = new THREE.Fog(0x050505, 100, 5000);

          scene.add( new THREE.AmbientLight( 0x505050 ) );

          var light = new THREE.SpotLight( 0xffffff, 1.5 );
          light.position.set( 0, 500, 2000 );
          light.castShadow = true;

          light.shadowCameraNear = 200;
          light.shadowCameraFar = camera.far;
          light.shadowCameraFov = 50;

          light.shadowBias = -0.00022;
          light.shadowDarkness = 0.5;

          light.shadowMapWidth = 2048;
          light.shadowMapHeight = 2048;

          scene.add( light );

          var geometry = new THREE.SphereGeometry( 40, 40, 40 );

          for ( var i = 0; i < 10; i ++ ) {

            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.material.ambient = object.material.color;

            object.position.x = Math.random() * 1000 - 500;
            object.position.y = Math.random() * 600 - 300;
            object.position.z = Math.random() * 800 - 400;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() * 2 + 1;
            object.scale.y = Math.random() * 2 + 1;
            object.scale.z = Math.random() * 2 + 1;

            object.castShadow = true;
            object.receiveShadow = true;

            scene.add( object );

            objects.push( object );

          }

          plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
            new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
          );
          plane.visible = false;
          scene.add( plane );

          renderer = new THREE.WebGLRenderer( { antialias: true } );
          renderer.setClearColor( 0xf0f0f0 );
          renderer.setSize( window.innerWidth, window.innerHeight );
          renderer.sortObjects = false;

          renderer.shadowMapEnabled = true;
          renderer.shadowMapType = THREE.PCFShadowMap;

          container.append( renderer.domElement );

          renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
          renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
          renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

          //

          window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setSize( window.innerWidth, window.innerHeight );

        }

        function onDocumentMouseMove( event ) {

          event.preventDefault();

          mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
          mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

          //

          var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );

          var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

          if ( SELECTED ) {

            var intersects = raycaster.intersectObject( plane );
            SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
            return;

          }

          var intersects = raycaster.intersectObjects( objects );

          if ( intersects.length > 0 ) {

            if ( INTERSECTED != intersects[ 0 ].object ) {

              if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

              INTERSECTED = intersects[ 0 ].object;
              INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

              plane.position.copy( INTERSECTED.position );
              plane.lookAt( camera.position );

            }


          } else {

            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

            INTERSECTED = null;


          }

        }

        function onDocumentMouseDown( event ) {

          event.preventDefault();

          var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );

          var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

          var intersects = raycaster.intersectObjects( objects );

          if ( intersects.length > 0 ) {

            controls.enabled = false;

            SELECTED = intersects[ 0 ].object;

            var intersects = raycaster.intersectObject( plane );
            offset.copy( intersects[ 0 ].point ).sub( plane.position );

          }

        }

        function onDocumentMouseUp( event ) {

          event.preventDefault();

          controls.enabled = true;

          if ( INTERSECTED ) {

            plane.position.copy( INTERSECTED.position );

            SELECTED = null;

          }

        }

        //

        function animate() {

          requestAnimationFrame( animate );

          render();

        }

        function render() {

          controls.update();

          renderer.render( scene, camera );

        }
      }
    }
  });
