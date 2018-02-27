var video0 = document.createElement( "video" );
var video1 = document.createElement( "video" );
video0.autoplay = true;
video1.autoplay = true;
var VIDEO_WIDTH = 0;
var VIDEO_HEIGHT = 0;
var mobile_size = {
  width: 0,
  height: 0
};
var isPortrait = true;

video0.addEventListener( "play", function() {
  VIDEO_WIDTH = this.videoWidth;
  VIDEO_HEIGHT = this.videoHeight;
  console.log(this.videoWidth, this.videoHeight);
  m.redraw();
}, false );

video1.addEventListener( "play", function() {
  console.log(this.videoWidth, this.videoHeight);
}, false );

getWebCam( video0, 2, function() {} );
getWebCam( video1, 1, function() {} );

var m = S.m;
m.mount( S.document.body, {
  controller: function() {
    var ctrl = {
      panelGeo: {
        type: "PlaneBuffer",
        value: [ 1, 1 ]
      },
      panel0Mtl: {
        type: "MeshBasic",
        value: {
          map: {
            type: "video",
            src: video0
          }
        }
      },
      panel1Mtl: {
        type: "MeshBasic",
        value: {
          map: {
            type: "video",
            src: video1
          }
        }
      }
    };

    return ctrl;
  },
  view: function( ctrl ) {
    return <scenes>
      <scene>
        <mesh geo={ ctrl.panelGeo } mtl={ ctrl.panel0Mtl } style={{ posZ: -1, rotateZ: isPortrait ? 0 : Math.PI / 2, scale: [ VIDEO_WIDTH / VIDEO_HEIGHT, 1, 1 ] }}/>
        <ocam id="cam0" height={ isPortrait ? 1 : undefined } width={ isPortrait ? undefined : 1 }/>
      </scene>
      <scene>
        <mesh geo={ ctrl.panelGeo } mtl={ ctrl.panel1Mtl } style={{ posZ: -1, rotateZ: isPortrait ? 0 : Math.PI / 2, scale: [ VIDEO_WIDTH / VIDEO_HEIGHT, 1, 1 ] }}/>
        <ocam id="cam1" height={ isPortrait ? 1 : undefined } width={ isPortrait ? undefined : 1 }/>
      </scene>
    </scenes>;
  }
});

function render() {
  m.render( S.document.head, <rdr config={ getCanvas } init={{ frame: "#app" }}>
    <vp cam="#cam0" width={ isPortrait ? 1 : .5 } height={ isPortrait ? .5 : 1 } />
    <vp cam="#cam1" width={ isPortrait ? 1 : .5 } height={ isPortrait ? .5 : 1 } top={ isPortrait ? .5 : 0 } left={ isPortrait ? 0 : .5 }/>
  </rdr> );
}
render();

var socket;
document.getElementById( "ip" ).addEventListener( "change", function() {
  socket = io.connect( "http://" + this.value );
});

function getCanvas( elem, isInit ) {
  if ( isInit ) return;

  var canvas = elem.coreObject.domElement;

  var peer = new Peer({key: '0abb642b-12ca-4041-a433-245b005ea625'});
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);

    peer.on('connection', function(conn) {
      conn.on('data', function(data) {
        if ( typeof data === "string" ) {
          console.log('Received', data);
          peer.call(data, canvas.captureStream() );
        } else if ( data.type === "deviceorientation" ) {
          socket && socket.emit( "deviceorientation", data.value );
        } else if ( data.type === "orientationchange" ) {
          socket && socket.emit( "orientationchange", data.value );
        } else if ( data.type === "resize" ) {
          mobile_size.width = data.value.width;
          mobile_size.height = data.value.height;
          isPortrait = mobile_size.width < mobile_size.height;
          setSize();
          m.redraw();
          render();
        }
      });
    });
  });
}

function setSize() {
  document.getElementById( "app" ).style.width = mobile_size.width + "px";
  document.getElementById( "app" ).style.height = mobile_size.height + "px";
}
