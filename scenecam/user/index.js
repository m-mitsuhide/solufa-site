var ua = navigator.userAgent.toUpperCase();
var isMobile = ua.indexOf('IPHONE') != -1 || (ua.indexOf('ANDROID') != -1 && ua.indexOf('MOBILE') != -1);
var isStereo = false;
var interval = 1; // second

S( function() {
  var App = {
    controller: function() {
      return {
        init: function( ctrl, elem, isInit ) {
          if ( isInit ) return;

          setInterval( function() {
            var time = new Date;
            ctrl.time = time.getFullYear()
              + "/" + ( "0" + ( time.getMonth()+1 ) ).slice( -2 )
              + "/" + time.getDate()
              + " " + ( "0" + time.getHours() ).slice( -2 )
              + ":" + ( "00" + time.getMinutes() ).slice( -2 )
              + ":" + ( "00" + time.getSeconds() ).slice( -2 );
          }, interval * 1000 );
        },
        setting: { // json file
          title: "TECH LAB PAAK"
        },
        time: "",
        started: false,
        start: function( ctrl ) {
          ctrl.started = true;
          if ( document.body.webkitRequestFullscreen ) {
            document.body.webkitRequestFullscreen();
          }
        },
        switch: function() {
          isStereo = !isStereo;

          S.m.redraw();
        }
      };
    },
    view: function( ctrl ) {

      return {tag: "div", attrs: {config: ctrl.init.bind( null, ctrl) }, children: [
        {tag: "div", attrs: {id:"solufa"}},
        {tag: "div", attrs: {style:{ display: ctrl.started ? "block" : "none"}}, children: [

          {tag: "div", attrs: {id:"title", style:{ display: isStereo ? "none" : "block"}}, children: [ ctrl.time ]},
          {tag: "div", attrs: {id:"switchStereo", style:{ display: isMobile ? "block" : "none"}, onclick: ctrl.switch}}
        ]},
        {tag: "div", attrs: {id:"start", style:{ display: ctrl.started ? "none" : "block"}, onclick: ctrl.start.bind( null, ctrl) }}
      ]};
    }
  };

  m.mount( document.getElementById( "app" ), App );
});

S( function( m ) {
  var imgName = "result.jpg?";
  function generateImgQuery() {
    var tmp = Math.floor( Date.now() / 1000 );
    return tmp - tmp % interval;
  }

  var App2 = {
		controller: function() {
			return {
        init: function( txr, elem, isInit ) {
          if ( isInit ) return;

          setInterval( function() {
            txr.src = imgName + generateImgQuery();
            txr.needsUpdate = true;
            window.m.redraw(); // timerを更新
          }, interval * 1000 );
        },
				geo: {
					type: "Sphere",
					value: [ .6, 32, 32 ]
				},
				mtl: {
					type: "MeshBasic",
					value: {
            map: {
              type: "image",
              src: imgName + generateImgQuery()
            },
            side: 2
          }
				},
        sphereStyle: { rotate: [ 0, -Math.PI / 2, -Math.PI / 2 ] },
				camStyle: { posZ: 0 },
        setUvs: function( elem, isInit ) {
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
			return {tag: "scene", attrs: {config: ctrl.init.bind( null, ctrl.mtl.value.map) }, children: [
				{tag: "mesh", attrs: {config: ctrl.setUvs, geo: ctrl.geo, mtl: ctrl.mtl, style: ctrl.sphereStyle}},
        m.component(JyroSync, {enabled:isMobile}, [
          {tag: "cam", attrs: {id:"cam", style:ctrl.camStyle}}
        ])
			]};
		}
	};

	m.render( S.document.body, App2 );

	m.mount( S.document.head, {
    view: function() {
		  return  {tag: "rdr", attrs: {init:{ frame: "#solufa", antialias: true}, clearColor:"#000"}, children: [
         isStereo ? m.component(StereoVp, {cam:"#cam", separation:.005})
            : isMobile ? {tag: "vp", attrs: {cam:"#cam"}} : m.component(OrbitVp, {cam:"#cam", enableZoom:false, enablePan:false, reverse:true})
  		]};
    }
	});

});
