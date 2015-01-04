'use strict';

angular.module('three')
  .directive('finalExample', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {

        var highLightEarth = false;
        var highLightMars = false;

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var sceneEarth = new THREE.Scene();
        var sceneMars = new THREE.Scene();
        var sceneBG = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        var cameraBG = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
        cameraBG.position.z = 50;

        // create a render and set the size
        var webGLRenderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
        webGLRenderer.setClearColor(new THREE.Color(0x000, 1.0));
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        webGLRenderer.shadowMapEnabled = true;

        var sphere = createEarthMesh(new THREE.SphereGeometry(10, 60, 60));
        sphere.position.x = -10;
        sphere.name = 'earth';

        var sphere2 = createMarshMesh(new THREE.SphereGeometry(5, 60, 60));
        sphere2.position.x = 10;
        sphere2.name = 'mars';

        sceneEarth.add(sphere);
        sceneMars.add(sphere2);

        // position and point the camera to the center of the scene
        camera.position.x = -10;
        camera.position.y = 15;
        camera.position.z = 50;

        camera.lookAt(new THREE.Vector3(0, 0, 0));


        var clock = new THREE.Clock();

        var ambi = new THREE.AmbientLight(0x181818);
        var ambi2 = new THREE.AmbientLight(0x181818);
        sceneEarth.add(ambi);
        sceneMars.add(ambi2);

        var spotLight = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(550, 100, 550);
        spotLight.intensity = 0.6;

        var spotLight2 = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(550, 100, 550);
        spotLight.intensity = 0.6;

        sceneEarth.add(spotLight);
        sceneMars.add(spotLight2);

        var materialColor = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("image/starry-deep-outer-space-galaxy.jpg"), depthTest: false });
        var bgPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), materialColor);
        bgPlane.position.z = -100;
        bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
        sceneBG.add(bgPlane);

        var ambientLight = new THREE.AmbientLight(0x181818);
        sceneBG.add(ambientLight);

        // add the output of the renderer to the html element
        element.append(webGLRenderer.domElement);

        var bgPass = new THREE.RenderPass(sceneBG, cameraBG);
        var renderPass = new THREE.RenderPass(sceneEarth, camera);
        renderPass.clear = false;
        var renderPass2 = new THREE.RenderPass(sceneMars, camera);
        renderPass2.clear = false;


        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;


        var clearMask = new THREE.ClearMaskPass();
        // earth mask
        var earthMask = new THREE.MaskPass(sceneEarth, camera);
//        earthMask.inverse = true;
        // mars mask
        var marsMask = new THREE.MaskPass(sceneMars, camera);
//        marsMask.inverse = true;

        var bloomPass = new THREE.BloomPass(3, 25, 5, 256);

        var effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
        effectColorify.uniforms[ 'color' ].value.setRGB(0.5, 0.5, 1);


        var composer = new THREE.EffectComposer(webGLRenderer);
        composer.renderTarget1.stencilBuffer = true;
        composer.renderTarget2.stencilBuffer = true;

        composer.addPass(bgPass);
        composer.addPass(renderPass);
        composer.addPass(renderPass2);
        composer.addPass(effectCopy);

        webGLRenderer.domElement.addEventListener( 'mousedown', onMouseDown, false );

        render();

        function createMarshMesh(geom) {
          var planetTexture = THREE.ImageUtils.loadTexture("image/Mars_2k-050104.png");
          var normalTexture = THREE.ImageUtils.loadTexture("image/Mars-normalmap_2k.png");

          var planetMaterial = new THREE.MeshPhongMaterial();
          planetMaterial.normalMap = normalTexture;
          planetMaterial.map = planetTexture;
//               planetMaterial.shininess = 150;


          // create a multimaterial
          var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

          return mesh;
        }

        function createEarthMesh(geom) {
          var planetTexture = THREE.ImageUtils.loadTexture("image/Earth.png");
          var specularTexture = THREE.ImageUtils.loadTexture("image/EarthSpec.png");
          var normalTexture = THREE.ImageUtils.loadTexture("image/EarthNormal.png");


          var planetMaterial = new THREE.MeshPhongMaterial();
          planetMaterial.specularMap = specularTexture;
          planetMaterial.specular = new THREE.Color(0x4444aa);


          planetMaterial.normalMap = normalTexture;
          planetMaterial.map = planetTexture;
//               planetMaterial.shininess = 150;


          // create a multimaterial
          var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

          return mesh;
        }

        function render() {

          webGLRenderer.autoClear = false;

          //sphere.rotation.y=step+=0.01;
          var delta = clock.getDelta();
          //orbitControls.update(delta);

          sphere.rotation.y += 0.001;
          sphere2.rotation.y += 0.002;

          // render using requestAnimationFrame
          requestAnimationFrame(render);

          composer.render(delta);
        }

        function onMouseDown (event) {
          event.preventDefault();

          if (!highLightMars && highLightEarth) {
            composer.passes.splice(3, 0, marsMask, bloomPass, clearMask);
            highLightMars = true;
          }

          if (!highLightEarth) {
            composer.passes.splice(3, 0, earthMask, bloomPass, clearMask);
            highLightEarth = true;
          }

        }

      }
    }
  });
