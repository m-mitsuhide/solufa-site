var Viewer = {
  vm: {
    rotation: false,
    isLandscape: false,
    init: function() {

    },
    rotate: function() {
      this.rotation = !this.rotation;
      setTimeout( this.landscape.bind( this ), 300 );
    },
    landscape: function() {
      this.isLandscape = this.rotation;
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
            {tag: "iframe", attrs: {allowfullscreen:true}}, 
            {tag: "div", attrs: {class:"ctrls cs", style:{ display: full.isFull ? "block" : "none", bottom: "5px", right: "5px"}}}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"ctrls rotate", style:{ bottom: "2.5%", left: "4%"}, onclick: vm.rotate.bind( vm)}}, 
      {tag: "div", attrs: {class:"ctrls share", style:{ top: "2.5%", left: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls close", style:{ top: "2.5%", right: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls fs", style:{ bottom: "2.5%", right: "4%"}}}
    ]};
  }
};

var full = {
  isFull: false,
  target: null,
  requestFullscreen: function( target ) {
    full.target = target;
    full.padding = target.root.style.paddingTop;

    if (target.root.webkitRequestFullscreen) {
      target.root.webkitRequestFullscreen(); //Chrome15+, Safari5.1+, Opera15+
    } else if (target.root.mozRequestFullScreen) {
      target.root.mozRequestFullScreen(); //FF10+
    } else if (target.root.msRequestFullscreen) {
      target.root.msRequestFullscreen(); //IE11+
    } else if (target.root.requestFullscreen) {
      target.root.requestFullscreen(); // HTML5 Fullscreen API仕様
    } else {
      target.root.style.position = "fixed";
      full.isFull = true;
    }

    setStyle( target.root, {
      height: "100%",
      paddingTop: 0
    });
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
      full.target.root.style.position = "relative";
      full.isFull = false;
    }

    setStyle( full.target.root, {
      height: full.padding ? "" : "100%",
      paddingTop: full.padding
    });

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

      setStyle( full.target.root, {
        height: "",
        paddingTop: full.padding
      });

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
