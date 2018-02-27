!function() {

var camID = [];
var waitList = null;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

window.MediaStreamTrack && MediaStreamTrack.getSources( function ( media_sources ) {


	media_sources.forEach( function( media ) {

		if ( media.kind == "video" ) {

			camID.push( media.id );

		}

	} );

	if ( !waitList ) return;

	waitList.forEach( function( data ) {
		navigator.getUserMedia(

			{ video: {width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },

				optional: [ { sourceId: camID[ data.index ] } ]

			} },

			function( localMediaStream ) {

				data.video.src = URL.createObjectURL( localMediaStream );
				data.callback( localMediaStream );

			},

			function( err ) {console.log(err)

				//that.error && that.error( err );

			}

		);
	});

	waitList = null;

} );


window.getWebCam = function( video, idx, callback ) {

	if ( !camID.length ) {
		waitList = waitList || [];
		waitList.push({
			video: video,
			index: idx,
			callback: callback
		});
	} else {

		navigator.getUserMedia(

			{ video: {

				optional: [ { sourceId: camID[ idx ] } ]

			} },

			function( localMediaStream ) {

				video.src = URL.createObjectURL( localMediaStream );
				callback( localMediaStream );

			},

			function( err ) {console.log(err)

				//that.error && that.error( err );

			}

		);
	}
};


}();
