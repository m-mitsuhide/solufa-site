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

			{ video: {
				mandatory: {
		      minWidth: 600,
		      minHeight: 1000,
		      minFrameRate: 30
		    },
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
