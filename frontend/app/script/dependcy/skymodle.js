new (function(){
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  var self = this;
  //var container;
  var start_time = Date.now();
  var mouseX = 0, mouseY = 0;
  self.renderer = null;
  self.scene= null;
  self.camera= null;;
  var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
  var windowHalfX = WIDTH / 2;
  var windowHalfY = HEIGHT / 2;
  var postprocessing = { enabled : false };
  var glow = 0.9;
  var group,pointLight;
  var textGeo;


  var height = 20,
    size = 70,
    hover = 30,

    curveSegments = 4,

    bevelThickness = 2,
    bevelSize = 1.5,
    bevelSegments = 3,
    bevelEnabled = true,

    font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
    weight = "bold", // normal bold
    style = "normal"; // normal italic

  var mirror = false;

  var fontMap = {
    "helvetiker": 0,
    "optimer": 1,
    "gentilis": 2,
    "droid sans": 3,
    "droid serif": 4

  };

  var weightMap = {
    "normal": 0,
    "bold": 1

  };
  //var textMaterial;
  var reverseFontMap = {};
  var reverseWeightMap = {};
  var textMesh1,textMesh2;

  for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
  for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;

  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;
  function capitalize( txt ) {
    return txt.substring( 0, 1 ).toUpperCase() + txt.substring( 1 );
  }

  function decimalToHex( d ) {
    var hex = Number( d ).toString( 16 );
    hex = "000000".substr( 0, 6 - hex.length ) + hex;
    return hex.toUpperCase();

  }


  //animate();
  self.init =function(param) {
    param||(param = {});
    self.text = param.text?param.text:"Welcome";
    var container = param.container?param.container:document.getElementById( 'container' );
    // Bg gradient

    var canvas = document.createElement( 'canvas' );
    canvas.width = 32;
    canvas.height = window.innerHeight;

    var context = canvas.getContext( '2d' );

    var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
    gradient.addColorStop(0, "#1e4877");
    gradient.addColorStop(0.5, "#4584b4");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 应用 WebGL 生成 base64 图像 作为容器的北京
    container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
    container.style.backgroundSize = '32px 100%';

    canvas = null;





    // 摄像机位
    self.camera = new THREE.PerspectiveCamera( 30, WIDTH / HEIGHT, 1, 10000 );
    self.camera.position.z = 10000; //机位
    self.camera.position.x = 100;
    self.camera.lookAt(new THREE.Vector3( 20,0,0 ));

    // camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    // camera.position.set( 100, 0, 10000 );

    // 场景
    self.scene = new THREE.Scene();
    self.scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );//雾
    self.scene.add(new THREE.AmbientLight(0xFC8A32));//灯光

    // 灯光
    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    dirLight.position.set( 0, 0, 1 ).normalize();
    self.scene.add( dirLight );

    pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 100, 4600 );
    self.scene.add( pointLight );

    /**
     * 元素群
     * 每个元素 需要定义 几何形状, 材料
     * 用材料包裹几何形状形成一个元素
     *	加入场景
     */
    //var geometry = new THREE.geometry
    //var material = new THREE.Material
    //var mesh = new THREE.Mesh( geometry, material );
    //self.scene.add( mesh );

    var geometry = new THREE.Geometry();
    // 定义一个球面 混合生成一个新的几何面
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

    for ( var i = 0; i < 8000; i++ ) {

      plane.position.x = Math.random() * 1000 - 500;
      plane.position.y = - Math.random() * Math.random() * 200 ;
      plane.position.z = i;
      plane.rotation.z = Math.random()/2 * Math.PI;
      plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

      THREE.GeometryUtils.merge( geometry, plane );

    }
    // loading 媒体文件 animate 为callback function 当媒体加载后执行
    var texture = THREE.ImageUtils.loadTexture( 'image/cloud10.png', null, animate );

    // 图像滤镜 比较专业不懂
    texture.minFilter = texture.magFilter = THREE.LinearMipMapLinearFilter;
    // 生成雾
    var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );
    // 给几何着色
    var material = new THREE.ShaderMaterial({
      attributes: {
        vertexOpacity: { type: 'f', value: [] }
      },
      uniforms: {
        "map": { type: "t", value: texture },
        "fogColor" : { type: "c", value: fog.color },
        "fogNear" : { type: "f", value: fog.near },
        "fogFar" : { type: "f", value: fog.far }
      },
      vertexShader: document.getElementById( 'vertexshader' ).textContent, // 很重要不太懂 生成每朵云
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
      depthWrite: false,
      depthTest: false,
      transparent: true // 继承Material
    })




    mesh = new THREE.Mesh( geometry, material );
    self.scene.add( mesh );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.z = - 8000;
    self.scene.add( mesh );

    // mesh = new THREE.Mesh( geometry, material );
    // mesh.position.z = - 20000;
    // self.scene.add( mesh );





    // 文字
    // var hash = document.location.hash.substr( 1 );

    // if ( hash.length !== 0 ) {

    // 	var colorhash  = hash.substring( 0, 6 );
    // 	var fonthash   = hash.substring( 6, 7 );
    // 	var weighthash = hash.substring( 7, 8 );
    // 	var pphash 	   = hash.substring( 8, 9 );
    // 	var bevelhash  = hash.substring( 9, 10 );
    // 	var texthash   = hash.substring( 10 );

    // 	hex = colorhash;
    // 	//pointLight.color.setHex( parseInt( colorhash, 16 ) );

    // 	font = reverseFontMap[ parseInt( fonthash ) ];
    // 	weight = reverseWeightMap[ parseInt( weighthash ) ];

    // 	postprocessing.enabled = parseInt( pphash );
    // 	bevelEnabled = parseInt( bevelhash );

    // 	text = decodeURI( texthash );

    // 	updatePermalink();

    // } else {

    // 	//pointLight.color.setHSL( Math.random(), 1, 0.5 );
    // 	//hex = decimalToHex( pointLight.color.getHex() );

    // }


    group = new THREE.Group();
    group.position.y = 50;
    group.position.z = 7000;
    self.scene.add( group );
    createText();
    // var plane = new THREE.Mesh(
    // 	new THREE.PlaneBufferGeometry( 10000, 10000 ),
    // 	new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
    // );
    // plane.position.y = 100;
    // plane.rotation.x = - Math.PI / 2;
    // self.scene.add( plane );







    self.renderer = new THREE.WebGLRenderer( { antialias: false,alpha: true } );
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( self.renderer.domElement );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );


    window.addEventListener( 'resize', onWindowResize, false );

  }
  function createText() {

     textGeo = new THREE.TextGeometry( self.text, {

      size: size,
      height: height,
      curveSegments: curveSegments,

      font: font,
      weight: weight,
      style: style,

      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled,

      material: 0,
      extrudeMaterial: 1

    });



    textGeo.computeBoundingBox();
    var textMaterial = new THREE.MeshFaceMaterial(
      [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
      ]
    );
    textMesh1 = new THREE.Mesh( textGeo, textMaterial );
    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );


    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;
    group.add( textMesh1 );
  }

  function refreshText() {
    group.remove( textMesh1 );
    if ( mirror ) group.remove( textMesh2 );
    if ( !self.text ) return;
    createText();

  }

  function onWindowResize() {

    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();

    self.renderer.setSize( window.innerWidth, window.innerHeight );

  }
  function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) * 0.25;
    mouseY = ( event.clientY - windowHalfY ) * 0.15;
    //refreshText()

  }
  function animate() {
    requestAnimationFrame( animate );
    // if(self.camera.position.z < 6000){
    // 	group.position.z = self.camera.position.z/2;
    // 	pointLight.position.set( 0, 100, self.camera.position.z/1.6 + 90 );
    // 		//refreshText();
    //   }
    var z = self.camera.position.z;
    position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;

    self.camera.position.x += ( mouseX - self.camera.position.x ) * 0.01;
    self.camera.position.y += ( - mouseY - self.camera.position.y ) * 0.01;
    self.camera.position.z = - position + 8000;

    if(z  < group.position.z){
      group.position.z = self.camera.position.z   - z *0.6;
      pointLight.position.set( 0, 100, self.camera.position.z - z *0.6+ 90 );
    }

    self.renderer.render( self.scene, self.camera );


  }
  return window.render3d = self;
})()