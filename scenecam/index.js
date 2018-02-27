var videoMaterial;
function reset() {
	videoMaterial.uniforms['mixRatio'].value = 0;
	requestAnimationFrame( function() {
		videoMaterial.uniforms['mixRatio'].value = 0.995;
	});
}

S( function() {

	var App = {
		controller: function() {
			return {};
		},
		view: function( ctrl ) {
			return <div>
				<div id="solufa"/>
				<div id="mainView"/>
				<div id="subView"/>
				<img id="qr" src="qr.gif?0"/>
				<input id="reset" type="button" value="reset" onclick={ reset }/>
			</div>;
		}
	};

	m.mount( document.getElementById( "app" ), App );


});

S( function( m ) {

	var video = document.createElement( "video" );
	video.autoplay = true;
	window.THREE = S.THREE;

	var mainTxr = {
		type: "canvas",
		src: document.createElement( "canvas" )
	};

	video.addEventListener('play', function() {
		var vidWidth = this.videoWidth;
		var vidHeight = this.videoHeight;
		document.getElementById( "solufa" ).style.width = vidWidth + "px";
		document.getElementById( "solufa" ).style.height = vidHeight + "px";

		var scene = S.document.getElementById( "scene" ).coreObject;
		var camera = new THREE.OrthographicCamera(vidWidth/-2, vidWidth/2, vidHeight/2, vidHeight/-2, 1, 2000);
		camera.position.z = 500;

		var renderer = S.document.getElementById( "rdr" ).coreObject;
		mainTxr.src = renderer.domElement;

		var gl = renderer.getContext();
		gl.getExtension( "OES_texture_float" );

		var rt1 = new THREE.WebGLRenderTarget( vidWidth, vidHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat, type: THREE.FloatType }  );
		var rt2 = new THREE.WebGLRenderTarget( vidWidth, vidHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat, type: THREE.FloatType }  );

		var videoTexture = new THREE.Texture( this );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBAFormat;

		videoMaterial = new THREE.ShaderMaterial(S.THREE.BlendShader);
		videoMaterial.uniforms['tDiffuse1'].value = videoTexture;
		videoMaterial.uniforms['tDiffuse2'].value = null;
		reset();

		var planeGeometry = new THREE.PlaneBufferGeometry( vidWidth, vidHeight, 1, 1 );
		var plane = new THREE.Mesh( planeGeometry, videoMaterial );
		plane.position.z = 400;

		scene.add(plane);


		var rtSwitch = true;
		var cam0 = S.document.getElementById( "cam" ).coreObject;
		var cam1 = S.document.getElementById( "subCam" ).coreObject;

		var timer = 0;

	  S.update( function( delta ) {
	    if(video.readyState !== video.HAVE_ENOUGH_DATA) return;
	    if(videoTexture) videoTexture.needsUpdate = true;

			cam1.position.copy( cam0.position );
			cam1.quaternion.copy( cam0.quaternion );

	    if(rtSwitch) renderer.render(scene, camera, rt2);
	    else renderer.render(scene, camera, rt1);

			timer += delta;
			if ( timer > 1000 ) {
				timer = 0;

				renderer.render( scene, camera );
				mainTxr.needsUpdate = true;

				var jpg = renderer.domElement.toDataURL( "image/jpeg" );
				m.request({ method: "POST", url: "./user/updateResult.php", data: { result: jpg } });
			}


	    if(rtSwitch) videoMaterial.uniforms['tDiffuse2'].value = rt2;
	    else videoMaterial.uniforms['tDiffuse2'].value = rt1;
	    rtSwitch = !rtSwitch;
	  });

	});

	var App2 = {
		controller: function() {
			return {
				sphereStyle: { scale: 300 },
				camStyle: { posZ: .1 },
				mainSphereGeo: {
					type: "Sphere",
					value: [ .1, 32, 32 ]
				},
				mainSphereMtl: {
					type: "MeshBasic",
					value: {
						map: mainTxr,
						side: 2
					}
				},
				mainSphereStyle: {
					rotate: [ 0, - Math.PI / 2, - Math.PI / 2 ]
				},
				setMainSphere: function( elem, isInit ) {
					if ( isInit ) return;

					var geometry = elem.coreObject.geometry;
				  var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
				  for ( i = 0; i < faceVertexUvs.length; i++ ) {
				    var uvs = faceVertexUvs[ i ];
				    var face = geometry.faces[ i ];
				    for ( var j = 0; j < 3; j ++ ) {
				      var x = face.vertexNormals[ j ].x;
				      var y = face.vertexNormals[ j ].y;
				      var z = face.vertexNormals[ j ].z;

				      if (i < faceVertexUvs.length / 2) {
				        var correction = (x == 0 && z == 0) ? 1 : (Math.acos(y) / Math.sqrt(x * x + z * z)) * (2 / Math.PI);
				        uvs[ j ].x = x * (428 / 1920) * correction + (480 / 1920);
				        uvs[ j ].y = z * (428 / 1080) * correction + (600 / 1080);

				      } else {
				        var correction = ( x == 0 && z == 0) ? 1 : (Math.acos(-y) / Math.sqrt(x * x + z * z)) * (2 / Math.PI);
				        uvs[ j ].x = -1 * x * (428 / 1920) * correction + (1440 / 1920);
				        uvs[ j ].y = z * (428 / 1080) * correction + (600 / 1080);
				      }
				    }
				  }
				}
			};
		},
		view: function( ctrl ) {
			return <scenes>
				<scene id="scene"/>
				<scene>
					<mesh geo={ ctrl.mainSphereGeo } mtl={ ctrl.mainSphereMtl } config={ ctrl.setMainSphere } style={ ctrl.mainSphereStyle }/>
					<cam id="cam" style={ ctrl.camStyle }/>
				</scene>
				<scene>
					<ThetaSphere video={video} style={ ctrl.sphereStyle }/>
					<cam id="subCam"/>
				</scene>
			</scenes>;
		}
	};

	m.mount( S.document.body, App2 );
	m.render( S.document.head, <rdrs>
		<rdr id="rdr" init={{ frame: "#solufa", antialias: true, preserveDrawingBuffer: true }} enabled={ false }/>
		<rdr init={{ frame: "#subView", antialias: true, preserveDrawingBuffer: false }}>
			<vp cam="#subCam"/>
		</rdr>
		<rdr init={{ frame: "#mainView", antialias: true, preserveDrawingBuffer: false }}>
			<OrbitVp cam="#cam" reverse={true}/>
		</rdr>
 	</rdrs>);

	function getRemoteCam() {
		var peer = new Peer({key: '0abb642b-12ca-4041-a433-245b005ea625'});

		peer.on('call', function(call) {
		  // Answer the call, providing our mediaStream
		  call.answer(null);

		  call.on('stream', function(stream) {
				console.log("Stream OK.");
			  video.src = URL.createObjectURL( stream );
			});
		});

		peer.on('open', function(id) {
			console.log('My peer ID is: ' + id);

			peer.listAllPeers(function(list){
				console.log(list);

				var conn = peer.connect(list[ 0 ]);
				conn.on('open', function() {
					conn.send( id );
				});
			});

		});
	}

	if ( !window.MediaStreamTrack ) {
		getRemoteCam();
	} else {

		MediaStreamTrack.getSources( function ( media_sources ) {

			var camID;

	    media_sources.forEach( function( media ) {

	      if ( media.kind == "video" && /^RICOH/.test( media.label ) ) {

	        camID = media.id;

	      }

	    } );

			if ( !camID ) {
				getRemoteCam();
				return;
			}

	    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	    window.URL = window.URL || window.webkitURL;
	    navigator.getUserMedia(

	      { video: {

	        optional: [ { sourceId: camID } ]

	      } },

	      function( localMediaStream ) {

	        if ( !video ) return;
	        video.src = URL.createObjectURL( localMediaStream );

	      },

	      function( err ) {console.log(err)

	        //that.error && that.error( err );

	      }

	    );

	  } );
	}
});
