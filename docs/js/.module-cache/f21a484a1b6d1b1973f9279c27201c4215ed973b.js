var Viewer = {
  vm: {
    rotation: false,
    isLandscape: false,
    iframe: null,
    iframeWindow: null,
    scripts: null,
    isOpen: true,
    value: "",
    thumbnail: "",
    init: function() {
      window.addEventListener( "message", function( e ) {
        //if ( !/:\/\/jthird.net$/.test( e.origin ) ) return;
        var json = JSON.parse( e.data );
        if ( json.loaded ) {
          this.send();
        } else if ( json.capture ) {
          this.thumbnail = json.capture;
          !this.isOpen && m.redraw();
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
      this.iframeWindow = window.frames[ 0 ];
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
    }
  },
  controller: function() {
    Viewer.vm.init();
  },
  view: function( a, data ) {
    var vm = Viewer.vm;
    vm.scripts = data.scripts;

    if ( data.needsUpdate ) {
      vm.value = data.value;
      if ( vm.iframeWindow ) vm.send();
    }

    return {tag: "div", attrs: {id: data.id}, children: [
      {tag: "div", attrs: {class: "device" + ( vm.rotation ? " rotation" : "")}, children: [
        {tag: "img", attrs: {class:"phone", src:"../img/iphone.png"}}, 
        {tag: "div", attrs: {class: "viewer" + ( vm.isLandscape ? " landscape" : "")}, children: [
          {tag: "div", attrs: {id:"fsTarget"}, children: [
            {tag: "iframe", attrs: {src: data.src, config: vm.getWindow.bind( vm), allowfullscreen:true}}, 
            {tag: "div", attrs: {class:"thumbnail", style:{ display: vm.isOpen ? "none" : "block", backgroundImage: "url(" + vm.thumbnail + ")"}, onclick: vm.send.bind( vm)}, children: [
              {tag: "div", attrs: {class:"play"}, children: [
                {tag: "div", attrs: {class:"arrow"}}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"ctrls cs", onclick: full.exitFullscreen, style:{ display: full.isFull ? "block" : "none", bottom: "15px", right: "15px"}}}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"ctrls rotate", style:{ bottom: "2.5%", left: "4%"}, onclick: vm.rotate.bind( vm)}}, 
      {tag: "div", attrs: {class:"ctrls share", style:{ top: "2.5%", left: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls close", style:{ top: "2.5%", right: "4%"}, onclick: vm.close.bind( vm)}}, 
      {tag: "div", attrs: {class:"ctrls fs", style:{ bottom: "2.5%", right: "4%"}, onclick: vm.fullscreen}}
    ]};
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
