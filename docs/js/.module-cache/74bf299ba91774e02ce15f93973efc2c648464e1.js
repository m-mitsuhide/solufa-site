var Viewer = {
  vm: {
    rotation: false,
    isLandscape: false,
    iframe: null,
    iframeWindow: null,
    init: function() {

    },
    rotate: function() {
      this.rotation = !this.rotation;
      setTimeout( this.landscape.bind( this ), 300 );
    },
    landscape: function() {
      this.isLandscape = this.rotation;
    },
    fullscreen: function() {
      full.requestFullscreen( document.getElementById( "fsTarget" ) );
    },
    getWindow: function( e, t ) {console.log(t)
      if ( this.iframeWindow ) return;
      this.iframeWindow = window.frames[ 0 ];
    }
  },
  controller: function() {
    Viewer.vm.init();
  },
  view: function( a, data ) {
    var vm = Viewer.vm;

    return {tag: "div", attrs: {id: data.id}, children: [
      {tag: "div", attrs: {class: "device" + ( vm.rotation ? " rotation" : "")}, children: [
        {tag: "img", attrs: {class:"phone", src:"../img/iphone.png"}}, 
        {tag: "div", attrs: {class: "viewer" + ( vm.isLandscape ? " landscape" : "")}, children: [
          {tag: "div", attrs: {id:"fsTarget"}, children: [
            {tag: "iframe", attrs: {src: data.src, config: vm.getWindow.bind( vm), allowfullscreen:true}}, 
            {tag: "div", attrs: {class:"ctrls cs", onclick: full.exitFullscreen, style:{ display: full.isFull ? "block" : "none", bottom: "15px", right: "15px"}}}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"ctrls rotate", style:{ bottom: "2.5%", left: "4%"}, onclick: vm.rotate.bind( vm)}}, 
      {tag: "div", attrs: {class:"ctrls share", style:{ top: "2.5%", left: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls close", style:{ top: "2.5%", right: "4%"}}}, 
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
