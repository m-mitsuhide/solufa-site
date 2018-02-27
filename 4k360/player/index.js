var capture_socket = io.connect( "http://160.16.64.254:8080" );
var arduino_socket = io.connect( "http://160.16.64.254:7170" );
var img0 = document.getElementById( "view0" );
var img1 = document.getElementById( "view1" );
var img_status = true;
var loadedTime = 0;

var loaded_counter = 0;


img0.addEventListener( "load", function() {
  img_status = true;
  URL.revokeObjectURL( this.src );
  loaded_counter++;
});

capture_socket.on( "updatedCapture", function( data ) {
  if ( img_status && loadedTime < data.time ) {

    loadedTime = data.time;
    img0.src = img1.src = URL.createObjectURL( new Blob( [ data.buffer ], { type: "image/jpeg" }) );

  }
});


var orientationValue = 0;

function orientationchange() {
  orientationValue = window.orientation || 0;
}

orientationchange();

window.addEventListener( 'orientationchange', orientationchange, false );

var RESIZE_LOOP_TIME = 1;

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
      isPortrait: isPortrait,
      fps: Math.floor( loaded_counter / RESIZE_LOOP_TIME )
    }
  });

  loaded_counter = 0;

}

setInterval( resize, RESIZE_LOOP_TIME * 1000 );
resize();


window.addEventListener( 'deviceorientation', function ( event ) {

  arduino_socket.emit( "deviceorientation", {
    type: "deviceorientation",
    value: {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      orientation: orientationValue
    }
  });

}, false );




document.getElementById( "start" ).addEventListener( "click", function() {
  if ( document.body.webkitRequestFullscreen ) {
    document.body.webkitRequestFullscreen();
  }

  var audio = new Audio;
  audio.loop = true;
  audio.src = "audio.mp3";

  audio.onplay = function() {
    capture_socket.emit( "updatedMobile", {
      type: "start",
      value: audio.currentTime
    });
  };

  audio.play();

  setInterval( function() {
    capture_socket.emit( "updatedMobile", {
      type: "currentTime",
      value: audio.currentTime
    });
  }, 500 );

  this.parentNode.removeChild( this );

}, false );


window.addEventListener( "beforeunload", function() {
  capture_socket.emit( "updatedMobile", {
    type: "close"
  });
});
