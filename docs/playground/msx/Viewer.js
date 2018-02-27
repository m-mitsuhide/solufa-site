var Viewer = {
  vm: {
    rotation: false,
    isLandscape: false,
    iframe: null,
    iframeWindow: null,
    scripts: null,
    isOpen: true,
    value: "",
    thumbnail: "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAAACAkQBADs=",
    onshare: null,
    init: function() {
      window.addEventListener( "message", function( e ) {
        //if ( !/:\/\/jthird.net$/.test( e.origin ) ) return;
        try {
          var json = JSON.parse( e.data );
        } catch( e ) {
          return;
        }

        if ( json.loaded ) {
          this.send();
        } else if ( json.capture ) {
          this.thumbnail = json.capture;

          if ( json.share ) {
            this.onshare({
              thumbnail: this.thumbnail,
              value: this.value
            });
          } else if ( !this.isOpen ) {
            m.redraw();
          }
        }
      }.bind( this ), false );
    },
    rotate: function() {
      this.rotation = !this.rotation;
      setTimeout( this.landscape.bind( this ), 300 );
    },
    landscape: function() {
      this.isLandscape = this.rotation;
      m.redraw();
    },
    fullscreen: function() {
      full.requestFullscreen( document.getElementById( "fsTarget" ) );
    },
    getWindow: function( e ) {
      if ( this.iframeWindow ) return;
      this.iframe = e;
      this.iframeWindow = window.frames[ 1 ];
    },
    send: function() {
      this.isOpen = true;
      this.iframeWindow.postMessage( JSON.stringify({ scripts: this.scripts, value: this.value }), "*" );
    },
    close: function() {
      if ( !this.isOpen ) return;

      this.isOpen = false;
      this.iframeWindow.postMessage( JSON.stringify({ capture: true }), "*" );
      this.iframeWindow.postMessage( JSON.stringify({ close: true }), "*" );
    },
    share: function() {
      if ( this.isOpen ) {
        this.iframeWindow.postMessage( JSON.stringify({ capture: true, share: true }), "*" );
      } else {
        this.onshare({
          thumbnail: this.thumbnail,
          value: this.value
        });
      }
    }
  },
  controller: function() {
    Viewer.vm.init();
  },
  view: function( a, data ) {
    var vm = Viewer.vm;
    vm.scripts = data.scripts;
    vm.onshare = data.onshare;

    if ( data.needsUpdate ) {
      vm.value = data.value;
      if ( vm.iframeWindow ) vm.send();
    }

    return <div id={ data.id }>
      <div class={ "device" + ( vm.rotation ? " rotation" : "")}>
        <img class="phone" src="../img/iphone.png"/>
        <div class={ "viewer" + ( vm.isLandscape ? " landscape" : "")}>
          <div id="fsTarget">
            <iframe src={ data.src } config={ vm.getWindow.bind( vm )} allowfullscreen/>
            <div class="thumbnail" style={{ display: vm.isOpen ? "none" : "block", backgroundImage: "url(" + vm.thumbnail + ")" }} onclick={ vm.send.bind( vm )}>
              <div class="play">
                <div class="arrow"/>
              </div>
            </div>
            <div class="ctrls cs" onclick={ full.exitFullscreen } style={{ display: full.isFull ? "block" : "none", bottom: "15px", right: "15px" }}/>
          </div>
        </div>
      </div>
      <div class="ctrls rotate" style={{ bottom: "2.5%", left: "4%" }} onclick={ vm.rotate.bind( vm )}/>
      <div class="ctrls share" style={{ top: "2.5%", left: "4%" }} onclick={ vm.share.bind( vm )}/>
      <div class="ctrls close" style={{ top: "2.5%", right: "4%" }} onclick={ vm.close.bind( vm )}/>
      <div class="ctrls fs" style={{ bottom: "2.5%", right: "4%" }} onclick={ vm.fullscreen }/>
    </div>;
  }
};

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
    }
    full.isFull = true;
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
