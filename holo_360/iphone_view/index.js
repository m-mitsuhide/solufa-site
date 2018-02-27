var capture_socket = io.connect( "http://160.16.64.254:8080" );
var img0 = document.getElementById( "view0" );
var img1 = document.getElementById( "view1" );
var img_status = true;
var loadedTime = 0;

img0.addEventListener( "load", function() {
  img_status = true;
  URL.revokeObjectURL( this.src );
});

capture_socket.on( "updatedCapture", function( data ) {
  if ( img_status && loadedTime < data.time ) {

    loadedTime = data.time;
    img0.src = img1.src = URL.createObjectURL( new Blob( [ data.buffer ], { type: "image/jpeg" }) );
  }
});


function orientation() {

  capture_socket.emit( "updatedMobile", {
    type: "orientationchange",
    value: window.orientation || 0
  });

}

orientation();

window.addEventListener( 'orientationchange', orientation, false );

function resize() {
  var isPortrait = window.innerWidth < window.innerHeight;
  var slideRatio = .52;
  var frame0 = document.getElementById( "frame0" );
  var frame1 = document.getElementById( "frame1" );

  var width;
  var height;

  if ( isPortrait ) {
    width = 1;
    height = slideRatio;
    frame0.style.width = "100%";
    frame0.style.height = "50%";

    frame1.style.width = "100%";
    frame1.style.height = "50%";
    frame1.style.top = "50%";
    frame1.style.left = 0;

    img0.style.width = img1.style.width = "100%";
    img0.style.height = img1.style.height = slideRatio * 200 + "%";
  } else {
    width = slideRatio;
    height = 1;
    frame0.style.width = "50%";
    frame0.style.height = "100%";

    frame1.style.width = "50%";
    frame1.style.height = "100%";
    frame1.style.top = 0;
    frame1.style.left = "50%";

    img0.style.width = img1.style.width = slideRatio * 200 + "%";
    img0.style.height = img1.style.height = "100%";

  }

  capture_socket.emit( "updatedMobile", {
    type: "resize",
    value: {
      width: width * window.innerWidth * window.devicePixelRatio,
      height: height * window.innerHeight * window.devicePixelRatio,
      isPortrait: isPortrait
    }
  });

}

resize();

window.addEventListener( 'resize', resize, false );

window.addEventListener( 'deviceorientation', function ( event ) {

  capture_socket.emit( "updatedMobile", {
    type: "deviceorientation",
    value: {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    }
  });

}, false );


if ( !document.body.webkitRequestFullscreen ) {
  document.getElementById( "start" ).style.display = "none";
} else {
  document.getElementById( "start" ).addEventListener( "click", function() {
    document.body.webkitRequestFullscreen();
    this.parentNode.removeChild( this );
    capture_socket.emit( "updatedMobile", {
      type: "start"
    });
  }, false );
}


window.addEventListener( "beforeunload", function() {
  capture_socket.emit( "updatedMobile", {
    type: "close"
  });
});
