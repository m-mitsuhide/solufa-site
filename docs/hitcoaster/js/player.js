!function() {
var enableGyro = false;
window.addEventListener('deviceorientation', function test(e) {
  enableGyro = e && e.alpha != null;
  window.removeEventListener( "deviceorientation", test );
  if ( enableGyro ) {
    m.startComputation();
    m.endComputation();
  }
});

var isPortrait = window.innerWidth < window.innerHeight;
window.addEventListener( "resize", function() {
  var tmp = window.innerWidth < window.innerHeight;
  if ( isPortrait !== tmp ) {
    isPortrait = tmp;
    m.startComputation();
    m.endComputation();
  }
}, false );

var full = {
  isFull: false,
  target: null,
  requestFullscreen: function( target ) {
    full.target = target;

    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen(); //Chrome15+, Safari5.1+, Opera15+
    } else if (target.mozRequestFullScreen) {
      target.mozRequestFullScreen(); //FF10+
    } else if (target.msRequestFullscreen) {
      target.msRequestFullscreen(); //IE11+
    } else if (target.requestFullscreen) {
      target.requestFullscreen(); // HTML5 Fullscreen API仕様
    } else {
      target.style.position = "fixed";
      full.isFull = true;
    }

  },
  exitFullscreen: function() {
    if ( document.exitFullscreen ) {
      document.exitFullscreen(); //HTML5 Fullscreen API仕様
    } else if ( document.cancelFullScreen ) {
      document.cancelFullScreen(); //Gecko:FullScreenAPI仕様
    } else if ( document.webkitCancelFullScreen ) {
      document.webkitCancelFullScreen(); //Chrome, Safari, Opera
    } else if ( document.mozCancelFullScreen ) {
      document.mozCancelFullScreen(); //Firefox
    } else if ( document.msExitFullscreen ) {
      document.msExitFullscreen();
    } else {
      full.target.style.position = "static";
      full.isFull = false;
    }

    full.target = null;
  },

  handleFSevent: function() {
    if( (document.webkitFullscreenElement && document.webkitFullscreenElement !== null)
     || (document.mozFullScreenElement && document.mozFullScreenElement !== null)
     || (document.msFullscreenElement && document.msFullscreenElement !== null)
     || (document.fullScreenElement && document.fullScreenElement !== null) ) {
      full.isFull = true;
    }else{
      full.isFull = false;
      if ( !full.target ) return;

      full.target = null;
    }
  },
  change: function( target ) {
    if ( full.isFull ) {
      full.exitFullscreen();
    } else {
      full.requestFullscreen( target );
    }
  }
};

document.addEventListener("webkitfullscreenchange", full.handleFSevent, false);
document.addEventListener("mozfullscreenchange", full.handleFSevent, false);
document.addEventListener("MSFullscreenChange", full.handleFSevent, false);
document.addEventListener("fullscreenchange", full.handleFSevent, false);

//storageを他からいじらない
var storage = JSON.parse( localStorage.userData || "{}" );
function getUserData( key ) {
  return storage[ key ];
}

function setUserData( key, value ) {
  storage[ key ] = value;
  localStorage.userData = JSON.stringify( storage );
}

var audio = new Audio;
audio.src = "bgm.mp3";
audio.loop = true;
audio.volume = .5;

var getPlanetData = function() {
  var planets = [
    {
      id: 0,
      name: "水星",//"水星(Mercury)",
      scale: .383,
      txr: "txr/mercury.jpg",
      distance: 5791
    },
    {
      id: 1,
      name: "金星",//"金星(Venus)",
      scale: .95,
      txr: "txr/venus.jpg",
      distance: 10820
    },
    {
      id: 2,
      name: "地球",//""地球(Earth)",
      scale: 1,
      txr: "txr/earth.jpg",
      distance: 14960
    },
    {
      id: 3,
      name: "月",//""月(Moon)",
      scale: .273,
      txr: "txr/moon.jpg",
      distance: 14960 + 37
    },
    {
      id: 4,
      name: "火星",//""火星(Mars)",
      scale: .532,
      txr: "txr/mars.jpg",
      distance: 22790
    },
    {
      id: 5,
      name: "木星",//""木星(Jupiter)",
      scale: 10.97,
      txr: "txr/jupiter.jpg",
      distance: 77830
    },
    {
      id: 6,
      name: "土星",//""土星(Saturn)",
      scale: 9.14,
      txr: "txr/saturn.jpg",
      distance: 142940
    },
    {
      id: 7,
      name: "天王星",//""天王星(Neptune)",
      scale: 3.98,
      txr: "txr/neptune.jpg",
      distance: 287500
    },
    {
      id: 8,
      name: "海王星",//""海王星(Uranus)",
      scale: 3.87,
      txr: "txr/uranus.jpg",
      distance: 450440
    },
    {
      id: 9,
      name: "冥王星",//""冥王星(Pluto)",
      scale: .187,
      txr: "txr/pluto.jpg",
      distance: 595400
    }
  ];

  return function( n ) {
    var idx = ( ( getUserData( "times" ) || 0 ) + 2 + ( n || 0 ) ) % ( planets.length * 2 - 2 );
    return planets[ idx > planets.length - 1 ? 2 * planets.length - idx - 2 : idx ];
  };

}();

var VRmode = {
  controller: function() {

  },
  view: function( a, attr ) {

    return {tag: "div", attrs: {id:"vrmode"}, children: [
      {tag: "p", attrs: {class:"shadow"}, children: [{tag: "span", attrs: {style:{ fontSize: "150%", color: "#ff0", fontWeight: "bold"}}, children: [getPlanetData().name]}, "から", {tag: "span", attrs: {style:{ fontSize: "150%", color: "#ff0", fontWeight: "bold"}}, children: [ getPlanetData( 1 ).name]}, "へ"]}, 
      {tag: "div", attrs: {class:"select"}, children: [
        {tag: "div", attrs: {class:"left", onclick: function() { attr.onSelect( false ) }}, children: [
          {tag: "img", attrs: {src:"img_player/vrmode0.jpg"}}, 
          {tag: "p", attrs: {class:"intro shadow"}, children: ["1画面でかざす"]}
        ]}, 
        {tag: "div", attrs: {class:"right", onclick: function() { attr.onSelect( true ) }}, children: [
          {tag: "img", attrs: {src:"img_player/vrmode1.jpg"}}, 
          {tag: "p", attrs: {class:"intro shadow"}, children: ["2画面で立体視"]}
        ]}
      ]}, 
      {tag: "p", attrs: {class:"shadow", style:{ margin: "30px 0 50px"}}, children: ["どっちのスタイルで遊ぶ？"]}, 
       !enableGyro ? {tag: "div", attrs: {class:"qrcode"}, children: [
        {tag: "div", attrs: {}, children: [
          {tag: "p", attrs: {class:"shadow"}, children: ["この端末の加速度センサーを検知出来ないため遊ぶことができません"]}, 
          {tag: "p", attrs: {class:"shadow"}, children: ["スマートフォンやタブレットなどのモバイル端末に変えて http://hitcoaster.com にアクセスする、または以下のQRコードから遊んでください。"]}, 
          {tag: "img", attrs: {src:"img_player/qrcode.gif?0"}}
        ]}
      ]} : null
    ]};
  }
};

var Create = {
	vm: {
    drawingTime: 0,
    currentTime: 0,
    first: true,
		init: function( elem, init, context ) {
      if ( !this.first ) return;
			this.canvas = elem;
			this.ctx = this.canvas.getContext( "2d" );
		  this.first = true;
		  this.prevPos = null;
		  this.prevTime = null;
		  this.path = [];

			window.addEventListener( "resize", this.resize, false );
			this.resize();
			context.onunload = this.onunload;

			$( elem ).one( "mousedown", function( e ) {
				if ( !this.first ) return;
				this.first = false;

				this.drawstart( e.clientX, e.clientY );

				$( this.canvas ).on( "mousemove", function( e ) {
					this.drawing( e.clientX, e.clientY );
				}.bind( this ) ).one( "mouseup", function() {
          if ( this.currentTime > 0 ) this.drawend();
				}.bind( this ) );

			}.bind( this ) ).one( "touchstart", function( e ) {
				if ( !this.first ) return;
				this.first = false;

				this.drawstart( e.originalEvent.touches[ 0 ].clientX, e.originalEvent.touches[ 0 ].clientY );

				$( this.canvas ).on( "touchmove", function( e ) {
					this.drawing( e.originalEvent.touches[ 0 ].clientX, e.originalEvent.touches[ 0 ].clientY );
					return false;
				}.bind( this ) ).one( "touchend", function() {
          if ( this.currentTime > 0 ) this.drawend();
				}.bind( this ) );
			}.bind( this ) )
      .on( "mousewheel DOMMouseScroll", false );

      m.redraw();//currentTimeの更新

		},
		resize: function() {
	    Create.vm.canvas.width = Create.vm.canvas.clientWidth;
	    Create.vm.canvas.height = Create.vm.canvas.clientHeight;
		},
		onunload: function() {
			window.removeEventListener( "resize", Create.vm.resize, false );
		},
		drawstart: function( x, y ) {

	    this.ctx.lineWidth = 5;
	    this.ctx.lineCap = "butt";
	    this.ctx.strokeStyle = "rgba( 255, 255, 0, .8 )";
	    this.prevTime = Date.now();

	    this.prevPos = [ x, y ];
	    this.path.push( { pos: this.prevPos, delta: 0, speed: 0 } );

      this.startTime = Date.now();
      this.intervalFn = setInterval( function() {
        this.currentTime =  this.drawingTime - Date.now() + this.startTime;
        if ( this.currentTime <= 0 ) {
          this.drawend();
        } else {
          m.redraw();
        }
      }.bind( this ), 100 );
	  },

	  drawing: function( x, y ) {
	    var pos = [ x, y ];
	    this.ctx.beginPath();
	    this.ctx.moveTo( this.prevPos[ 0 ], this.prevPos[ 1 ] );
	    this.ctx.lineTo( pos[ 0 ], pos[ 1 ] );
	    this.ctx.stroke();

	    var time = Date.now();
	    var speed = Math.sqrt( Math.pow( this.prevPos[ 0 ] - pos[ 0 ], 2 ) + Math.pow( this.prevPos[ 1 ] - pos[ 1 ], 2 ) ) / ( time - this.prevTime );

	    this.prevPos = pos;
	    this.path.push( { pos: pos, speed : speed, delta: time - this.prevTime } );
	    this.prevTime = time;
	  },

	  drawend: function() {
      clearInterval( this.intervalFn );

	    var width = this.canvas.width / 2;
	    var height = this.canvas.height / 2;
	    this.path.forEach( function( data ) {
	      data.pos[ 0 ] = ( data.pos[ 0 ] - width ) / width;
	      data.pos[ 1 ] = ( data.pos[ 1 ] - height ) / height;
	    });

      $( this.canvas ).off( "mousemove touchmove" );

      this.first = true;
	    this.onCreate( this.path );
	  }
	},
	controller: function( a ) {
		Create.vm.onCreate = a.onCreate;
    audio.load();
    Create.vm.currentTime = Create.vm.drawingTime = Math.min( 6000, ( getUserData( "times" ) || 0 ) * 200 + 3000 );
	},
	view: function( a, data ) {
		var vm = Create.vm;
		return {tag: "div", attrs: {id:"create"}, children: [
      {tag: "p", attrs: {class:"intro"}, children: ["一筆書きでコースをつくろう"]}, 
			{tag: "div", attrs: {class:"circle", style:{right: "30px", top: "30px", backgroundColor: "rgba( 0, 200, 200, .7 )"}}, children: [
        {tag: "span", attrs: {}, children: ["START"]}
      ]}, 
			{tag: "div", attrs: {class:"circle", style:{left: "30px", bottom: "30px", backgroundColor: "rgba( 255, 150, 0, .7 )"} }, children: [
        {tag: "span", attrs: {}, children: ["GOAL"]}
      ]}, 
      {tag: "div", attrs: {class:"timer"}, children: [ vm.currentTime < 0 ? "0:00" : Math.floor( vm.currentTime / 1000 ) + ":" + ( "00" + Math.floor( 60 * ( vm.currentTime % 1000 ) / 1000 ) ).slice( -2 )]}, 
			{tag: "canvas", attrs: {config: vm.init.bind( vm) }}
    ]};
	}
};

var Playing = {
	vm: {
		j3loaded: false,
		rails: null,
		orbit: null,
		stereo: null,
		ready: false,
    textVisible: false,
		area: { x: 1000, y: 500,z: 500 },
		course: [],
    projector: null,
    vector: null,
    startPanelPos: { left: 0, top: 0 },
    goalPanelPos: { left: 0, top: 0 },
		init: function() {
			if ( !this.j3loaded ) {
				jThree.goml( document.getElementById( "goml" ).innerText, function( j3 ) {
					this.j3loaded = true;
					this.init.bind( this )();
				}.bind( this ), function() {
          alert( "このデバイスは対応しておりません。" );
          Player.onChange( "vrmode" );
        } );
				return;
			}

			var j3 = jThree;
      j3( "#startTxr" ).attr( "src", getPlanetData().txr );
      j3( "#goalTxr" ).attr( "src", getPlanetData( 1 ).txr );
      j3( "#start" ).scale( Math.sqrt( getPlanetData().scale ) );
      j3( "#goal" ).scale( Math.sqrt( getPlanetData( 1 ).scale ) );
      j3( "#ring" ).hide();

      if ( getPlanetData().id === 6 ) {
        j3( "#ring" ).show().appendTo( "#start" );
      } else if ( getPlanetData( 1 ).id === 6 ) {
        j3( "#ring" ).show().appendTo( "#goal" );
      }

			if ( !this.audio ) {//初回だけ
				this.audio = audio;

				this.rails = j3( "#rails" ).three( 0 );
				this.orbit = j3.Orbit();
				this.stereo = j3.Stereo().stop();
	    	this.stereo.effect.separation = 1;

				this.dammyCam = j3( "#dammyCam" ).three(0);
				this.vr = j3.MobileVR("camera:last");

        this.projector = new THREE.Projector;
        this.vector = new THREE.Vector3;

				var scene = j3( "scene" ).three( 0 );

				!function loop() {
					j3( "#start" ).animate( { rotateY: "+=6.28" }, 100000, loop );
				}();

				!function loop() {
					j3( "#goal" ).animate( { rotateY: "+=6.28" }, 100000, loop );
				}();

				var geo = new THREE.Geometry;
				for ( var i = 0; i < 20000; i++ ) {
						geo.vertices.push( new THREE.Vector3( Math.random() * 2000 - 1000, Math.random() * 1000 - 500, Math.random() * 2000 - 1000 ) );
				}

				var mtl = new THREE.ParticleSystemMaterial({color: "#fff", size: 1 });
				scene.add( new THREE.ParticleSystem( geo, mtl ) );


			}

      j3( "rdr" ).attr( "rendering", true );

      this.audio.currentTime = 8;
      this.orbit.enabled = true;
      var aspect = window.innerWidth / window.innerHeight;
      this.area.x = aspect > 1 ? 1000 : 500;
      this.area.z = aspect > 1 ? 500 : 1000;

			for ( var i = this.rails.children.length - 1; i > -1; i-- ) {
				this.rails.remove( this.rails.children[ i ] );
			}

			var newPath = [];
		  var curveData = [];
		  var past = [];
		  var maxspeed;
		  var minspeed;
			var path = this.path;

		  path.forEach( function( data, idx ) {
		    data.pos[ 2 ] = data.pos[ 1 ];

		    past.push( idx === 0 ? 0 : data.speed );
		    if ( past.length > 5 ) past.shift();

		    var sum = 0;
		    past.forEach( function( y ) {
		      sum += y;
		    });
		    data.pos[ 1 ] = sum / Math.min( 5, idx + 1 );
		    if ( idx ) {
		      if ( maxspeed === undefined ) {
		        maxspeed = minspeed = data.pos[ 1 ];
		      } else if ( maxspeed < data.pos[ 1 ] ) {
		        maxspeed = data.pos[ 1 ];
		      } else if ( minspeed > data.pos[ 1 ] ) {
		        minspeed = data.pos[ 1 ];
		      }
		    }
		  });

		  var tmpPath = [];
		  path.forEach( function( data, idx ) {
		    if ( idx % 3 !== 1 ) return;//減らすとなめらかになる

		    tmpPath.push( data.pos );
		    if ( !idx ) {
		      data.pos[ 1 ] = 1.2;
		    } else {
		      data.pos[ 1 ] = ( 1 - ( data.pos[ 1 ] - minspeed ) / ( maxspeed - minspeed ) ) * 0.8;
		    }
		  });
		  var spline = new BSpline( tmpPath,3);
		  for(var t = 0;t<=10000;t+=1){
		    newPath.push( spline.calcAt(t * 0.0001) );
		    if ( t > 2 ) {
		      var v0 = new THREE.Vector3( newPath[ t - 2 ][ 0 ] - newPath[ t - 1 ][ 0 ], 0, newPath[ t - 2 ][ 2 ] - newPath[ t - 1 ][ 2 ] );
		      var v1 = new THREE.Vector3( newPath[ t - 1 ][ 0 ] - newPath[ t ][ 0 ], 0, newPath[ t - 1 ][ 2 ] - newPath[ t ][ 2 ] );
		      var angle = v1.length() === 0 || v0.length() === 0 ? 0 : Math.acos( v0.dot( v1 ) / ( v0.length() * v1.length() ) );

		      //高さだけで判定したい
		      var speed = Math.sqrt( 2 * 49 * 500 * ( 1 - newPath[ t - 1 ][ 1 ] ) + 100 * 100 );
		      var curve = curveData[ t - 1 ] + speed * ( new THREE.Vector3().crossVectors( v0, v1 ).y  );

		      curveData.push( Math.max( - Math.PI / 2, Math.min( curve, Math.PI / 2 ) ) );

		    } else {
		      curveData.push( 0 );
		    }
		  }

			var scene = j3( "scene" ).three( 0 );
			var area = this.area;


			var railGeo = j3( "#railGeo" ).three( 0 );
			var railMtl = j3( "#railMtl" ).three( 0 );

			this.course.length = 0;
			var course = this.course;

            var poses = [];
			newPath.forEach( function( data, idx ) {
				course.push( [ data[ 0 ] * area.x, data[ 1 ] * area.y, data[ 2 ] * area.z ] );

				if ( idx % 20 === 0 || idx === newPath.length - 1 ) {
					if ( idx < newPath.length - 1 ) {
						var obj = new THREE.Object3D;
						obj.position.set( data[ 0 ] * area.x, data[ 1 ] * area.y, data[ 2 ] * area.z );
						obj.lookAt( new THREE.Vector3( newPath[ idx + 1 ][ 0 ] * area.x, newPath[ idx + 1 ][ 1 ] * area.y, newPath[ idx + 1 ][ 2 ] * area.z ) );
            obj.updateMatrixWorld();
            poses.push( obj.localToWorld( new THREE.Vector3( -10, -10, 0 ) ) );

            poses.push( obj.localToWorld( new THREE.Vector3( 10, -10, 0 ) ) );

						this.rails.add( obj );
					}
				}
			}.bind( this ) );

      var geo = new THREE.Geometry;
      poses.forEach( function( pos ) {
      	geo.vertices.push( pos );

      }.bind(this));
      for ( var i = 0; i < 1000 - 3; i++ ) {
        geo.faces.push( new THREE.Face3( i, i + 2, i + 1, null, null, 0 ) );
        geo.faces.push( new THREE.Face3( i + 1, i + 2, i + 3, null, null, 0 ) );
      }
      geo.computeFaceNormals();
      this.rails.add( new THREE.Mesh( geo, railMtl ));
      this.rails.add( new THREE.Mesh( geo, new THREE.MeshBasicMaterial({color: 0x888888, wireframe: true}) ));

			j3( "#corster, #start" ).position( course[ 0 ] );
      j3( "#goal" ).position( course[ course.length - 1 ] );

			j3( "camera" ).position( 0, isPortrait ? 2500 : 1500, .1 ).lookAt( 0, 0, 0 );

			this.ready = true;
      this.playing = true;
      this.textVisible = true;
			this.projectorFn = function() {
        this.projector.projectVector( this.vector.copy( this.start.position ), this.camera );
        this.vm.startPanelPos.left = this.vector.x;
        this.vm.startPanelPos.top = this.vector.y;
        this.projector.projectVector( this.vector.copy( this.goal.position ), this.camera );
        this.vm.goalPanelPos.left = this.vector.x;
        this.vm.goalPanelPos.top = this.vector.y;

        $( ".panel", "#playing" ).eq( 0 ).css({
          top: Create.vm.canvas.height / 2 * ( 1 - this.vm.startPanelPos.top ),
          left: Create.vm.canvas.width / 2 * ( 1 + this.vm.startPanelPos.left )
        }).next().css({
          top: Create.vm.canvas.height / 2 * ( 1 - this.vm.goalPanelPos.top ),
          left: Create.vm.canvas.width / 2 * ( 1 + this.vm.goalPanelPos.left )
        });
      }.bind( {
        camera: j3( "camera" ).three( 0 ),
        projector: this.projector,
        vector: this.vector,
        start: j3( "#start" ).three( 0 ),
        goal: j3( "#goal" ).three( 0 ),
        vm: this
      } );

      j3.update( this.projectorFn );

		},
		go: function() {
			var j3 = jThree;
			this.audio.play();
			this.ready = false;
			this.orbit.enabled = false;

      j3.update( this.projectorFn, false );

			var dammyCam = this.dammyCam;
			var vr = this.vr;
      vr.start();
			var camQ = dammyCam.quaternion;
			dammyCam.useQuaternion = true;

			var euler = new THREE.Euler;
			euler.setFromQuaternion( camQ, vr.control.object.eulerOrder );
			euler.x = euler.z = 0;
			euler.y = - euler.y;


			var v0 = 5;
			var h0 = this.area.y;
			var g = 49;
			var E = 0.5 * v0 * v0 + g * h0;

			var currentIndex = 0;
			var v1 = v0;

			function betweenL( idx ) {
				var pos0 = course[ idx ];
				var pos1 = course[ idx + 1 ];
				return Math.sqrt( Math.pow( pos1[ 0 ] - pos0[ 0 ], 2 ) + Math.pow( pos1[ 1 ] - pos0[ 1 ], 2 ) + Math.pow( pos1[ 2 ] - pos0[ 2 ], 2 ) );
			}

			var corster = j3( "#corster" ).three( 0 );
			corster.useQuaternion = true;

			var q1 = new THREE.Quaternion;
			var q3 = new THREE.Quaternion;
			var course = this.course;

			var viewCam = j3( "camera" ).position( course[ 0 ] ).lookAt( course[ 1  ] ).translateY( 10 ).three(0);
			viewCam.useQuaternion = true;

			this.stereo[ this.vrMode ? "start" : "stop" ]();
			var update = function( delta ) {

        var long = v1 * delta / 1000;
        var L = 0;
        for ( var i = currentIndex;; i++ ) {
          if ( !course[ i + 1 ] ) {
            currentIndex = i;
						j3.update( update, false );
            this.audio.pause();
            this.playing = false;
            this.stereo.stop();
            this.vr.stop();
            j3( "rdr" ).attr( "rendering", false );
						this.onStop();
            break;
          }

          L += betweenL( i );
          if ( L >= long ) {
            currentIndex = i + 1;
            break;
          }
        }
        //j3( "camera" ).lookAt( course[ currentIndex ] );
        j3( "#corster" ).position( course[ currentIndex ] ).lookAt( course[ currentIndex + 1 ] );
        v1 = Math.sqrt( 2 * g * ( h0 - course[ currentIndex ][ 1 ] ) + v0 * v0 );

        q1.copy( camQ );
        q3.copy( corster.quaternion );
        viewCam.quaternion.copy( q3.multiply( q1 ) );
        viewCam.position.copy( corster.position );

      }.bind( this );

      setTimeout( function() {
        this.textVisible = false;
        m.redraw();
      }.bind( this ), 3000 );
      j3.update( update );
    }
	},
	controller: function( a ) {
		Playing.vm.vrMode = a.isVr;
		Playing.vm.path = a.path;
		Playing.vm.onStop = a.onStop;
		Playing.vm.init();
	},
	view: function() {
		var vm = Playing.vm;
		return {tag: "div", attrs: {id:"playing"}, children: [
      {tag: "div", attrs: {class: "nose" + ( isPortrait ? ".portrait" : ""), style:{ display: vm.vrMode && vm.playing && !vm.ready ? "block" : "none"}}}, 
      {tag: "div", attrs: {class:"panel", style:{ display: vm.ready ? "block" : "none", backgroundColor: "rgba( 0, 200, 200, .7 )"}}, children: ["START"]}, 
      {tag: "div", attrs: {class:"panel", style:{ display: vm.ready ? "block" : "none", backgroundColor: "rgba( 255, 150, 0, .7 )"}}, children: ["GOAL"]}, 
      {tag: "div", attrs: {class:"text shadow", style:{ display: vm.textVisible ? "block" : "none"}}, children: [ vm.ready ? "ドラッグでアングル操作" : "スマホの方角でアングル操作"]}, 
			{tag: "div", attrs: {class:"go", style:{ display: vm.ready ? "block" : "none"}, onclick: vm.go.bind( vm) }, children: ["Go!!!", {tag: "p", attrs: {style:{ fontSize: "50%", fontWeight: "normal"}}, children: ["※BGMが鳴るので音量に注意"]}]}
		]};
	}
};

var Goal = {
  controller: function() {

  },
  view: function( a, attr ) {

    return {tag: "div", attrs: {id:"goal", class:"shadow"}, children: [
      {tag: "div", attrs: {}, children: [
        {tag: "div", attrs: {style:{ fontWeight: "bold", fontSize: "300%"}}, children: ["GOAL!!!"]}, 
        {tag: "div", attrs: {}, children: [ getPlanetData( -1 ).name + "から" + getPlanetData().name + "まで", {tag: "span", attrs: {style:{ fontSize: "150%", color: "#ff0", fontWeight: "bold"}}, children: [ attr.distance]}, "万km走りました。"]}, 
        {tag: "div", attrs: {}, children: ["次は", {tag: "span", attrs: {style:{ fontSize: "150%", color: "#ff0", fontWeight: "bold"}}, children: [ getPlanetData( 1 ).name]}, "を目指そう！"]}, 
        {tag: "div", attrs: {}, children: ["一筆書きの時間が少し伸びました。(最大6秒)"]}, 
        {tag: "div", attrs: {}, children: ["飛び出すダンボールデバイス「ハコスコ」の情報は以下をタップ"]}, 
        {tag: "a", attrs: {href:"http://hacosco.com/product/", target:"_brank", style:{ display: "block", margin: "0 auto", maxWidth: "500px"}}, children: [{tag: "img", attrs: {src:"img_player/hacosco.jpg", style:{ width: "100%"}}}]}, 
        {tag: "div", attrs: {style:{ padding: "40px 0 20px"}}, children: ["不思議なBGMの歌詞とフルバージョンは以下をチェック！"]}, 
        {tag: "div", attrs: {style:{ maxWidth: "500px", margin: "0 auto"}}, children: [
          {tag: "div", attrs: {style:{ position: "relative", paddingTop: "75%"}}, children: [
            {tag: "iframe", attrs: {src:"https://www.youtube.com/embed/k3ZD0zClECQ", frameborder:"0", allowfullscreen:true,style:{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}}
          ]}
        ]}, 
        {tag: "div", attrs: {class:"end", onclick: attr.onEnd}, children: ["NEXT→"]}
      ]}
    ]};
  }
};


var Player = {
	vm: {
		mode: {
			vrmode: function() {
				return m.component( VRmode, { onSelect: Player.onSelectVRmode });
			},
			create: function() {
        Player.vm.playing = true;
				return m.component( Create, { onCreate: Player.onCreate });
			},
			playing: function() {
				return m.component( Playing, { onStop: Player.onStop, path: Player.vm.path, isVr: Player.vm.isVr });
			},
			goal: function() {
				return m.component( Goal, { onEnd: Player.onEnd, distance: Player.vm.distance });
			},
		},
		init: function() {
			this.current = "vrmode";
			this.isVr = false;
      this.isFirst = true;
      this.playing = false;
      this.distance = 0;
		}
	},
	onChange: function( mode ) {
		Player.vm.current = mode;
		m.startComputation();
		m.endComputation();
	},
  onSelectVRmode: function( bool ) {

    Player.vm.isVr = bool;
    if ( Player.vm.isFirst ) {
      Player.vm.isFirst = false;
    }

    full.requestFullscreen( document.getElementById( "player" ) );
    Player.onChange( "create" );
  },
  onCreate: function( path ) {
		Player.vm.path = path;
		Player.onChange( "playing" );
  },
	controller: function() {
		Player.vm.init();
	},
  onStop: function() {
		Player.vm.playing = false;
    setUserData( "times", ( getUserData( "times" ) || 0 ) + 1 );

    var course = Playing.vm.course;
    var distance = 0;
    course.forEach( function( pos, idx ) {
      if ( !idx ) return;
      distance += Math.sqrt( Math.pow( pos[ 0 ] - course[ idx - 1 ][ 0 ], 2 ) + Math.pow( pos[ 1 ] - course[ idx - 1 ][ 1 ], 2 ) + Math.pow( pos[ 2 ] - course[ idx - 1 ][ 2 ], 2 ) );
    });

    Player.vm.distance = Math.floor(
      Math.abs( getPlanetData( -1 ).distance - getPlanetData().distance ) * distance / Math.sqrt( Math.pow( course[ 0 ][ 0 ] - course[ course.length - 1 ][ 0 ], 2 ) + Math.pow( course[ 0 ][ 1 ] - course[ course.length - 1 ][ 1 ], 2 ) + Math.pow( course[ 0 ][ 2 ] - course[ course.length - 1 ][ 2 ], 2 ) )
    );
    $.post( "http://bridge-note.com/coaster/", { id: getUserData( "id" ), distance: Player.vm.distance, times: getUserData( "times" ) }, function( id ) {
      setUserData( "id", +id );
    });
    /*m.request( { method: "post", url: "data/", data: { id: getUserData( "id" ), distance: distance, times: getUserData( "times" ) } } ).then( function( id ) {
      setUserData( "id", id );
      m.redraw.strategy("none");
    });*/

		Player.onChange( "goal" );
  },
  onEnd: function() {
    full.exitFullscreen();
		Player.onChange( "vrmode" );
  },
	view: function( a, data ) {
		var vm = Player.vm;

		return {tag: "div", attrs: {style:{ minHeight: data.height + "px"}}, children: [
      {tag: "div", attrs: {id:"player"}, children: [
        {tag: "div", attrs: {id:"jthree", style:{ left: vm.playing ? 0 : "100%"}}}, 
         vm.mode[ vm.current ](), 
        m.component(SnsBtn, {mode: vm.current})
      ]}
    ]};
	}
};

window.Player = Player;
}();
