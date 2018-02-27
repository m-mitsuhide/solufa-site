var stats = new Stats();
stats.domElement.style.position = "fixed";
stats.domElement.style.left    = "5px";
stats.domElement.style.top      = "5px";
document.body.appendChild(stats.domElement);

requestAnimationFrame( function update() {
  requestAnimationFrame( update );
  stats.update();
});

// var peer = new Peer({key: '0abb642b-12ca-4041-a433-245b005ea625'});
var peer = new Peer({
  host: 'peer.spot-corp.com',
  path: '/api',
  port: 443,
  secure: true,
  config: {'iceServers':
    [ {'url':'stun:stun.spot-corp.com:3478'} ]
  }
});

// var v0 = document.getElementById( "v0" );
// var v1 = document.getElementById( "v1" );
var video = document.getElementById( "video" );

peer.on('call', function(call) {
  // Answer the call, providing our mediaStream
  call.answer(null);

  call.on('stream', function(stream) {
    console.log("Stream OK.");
    // var first_stream = new webkitMediaStream;
    // var second_stream = new webkitMediaStream;
    // first_stream.addTrack( stream.getVideoTracks()[ 0 ] );
    // second_stream.addTrack( stream.getVideoTracks()[ 1 ] );
    // v0.src = URL.createObjectURL( first_stream );
    // v1.src = URL.createObjectURL( second_stream );
    video.src = URL.createObjectURL( stream );
  });
});

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);

  peer.listAllPeers(function(list){
    console.log(list);

    var conn = peer.connect( list[ list[ 0 ] === id ? 1 : 0 ] );
    conn.on('open', function() {
      conn.send( id );

      function orientation() {

        conn.send({
          type: "orientationchange",
          value: window.orientation || 0
        });

    	}

      orientation();

      window.addEventListener( 'orientationchange', orientation, false );

      function resize() {

        conn.send({
          type: "resize",
          value: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        });

    	}

      resize();

      window.addEventListener( 'resize', resize, false );

      window.addEventListener( 'deviceorientation', function ( event ) {

        conn.send({
          type: "deviceorientation",
          value: {
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma
          }
        });

    	}, false );

      document.getElementById( "start" ).addEventListener( "click", function() {
        document.body.webkitRequestFullscreen();
        this.parentNode.removeChild( this );
        conn.send({
          type: "start"
        });
      }, false );

    });
  });

});
