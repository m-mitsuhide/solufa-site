var App = {
  vm: {
    scripts: { version: 0, src: [ "Solufa.min.js", "Solufa-OrbitVp.js", "Solufa-StereoVp.js", "Solufa-JyroSync.js", "MSXTransformer.js" ] },
    baseLength: 0,
    language: (window.navigator.languages && window.navigator.languages[0]) ||
      window.navigator.language ||
      window.navigator.userLanguage ||
      window.navigator.browserLanguage,
    isPortrait: false,
    value: JSON.parse(localStorage.PlayGroundData || "null"),
    defaultValue: "",
    needsUpdate: true,
    isCloseDoc: 1,
    currentDoc: "",
    docSrc: {
      j3: "",
      mithril: ""
    },
    displayQR: false,
    isOpenedEditor: false,
    toggleEditor: function() {
      this.isOpenedEditor = !this.isOpenedEditor;
      m.redraw();
    },
    openQR: function() {
      this.displayQR = true;
    },
    closeQR: function() {
      this.displayQR = false;
    },
    init: function() {
      window.addEventListener( "resize", this.resize.bind( this ), false );
      this.resize();
      var id = this.idAdmin();

      var xhr = new XMLHttpRequest;
      xhr.open( "get", "default.js" );
      xhr.onload = function() {
        App.vm.defaultValue = this.response;
        !id && App.vm.save();
        id = null;
      };
      xhr.send( null );

      if ( id ) {
        var xhr2 = new XMLHttpRequest;
        xhr2.open( "get", "works/" + id + "/index.msx" );
        xhr2.onload = function() {
          App.vm.value = this.response;
          App.vm.save();
        };
        xhr2.send( null );
      }
    },
    idAdmin: function( id ) {
    	if ( !id ) {
    		return location.search.slice( 4 );
    	} else {
        history.pushState(null,null, id === "./" ? "./" : "./?id=" + id );
    	}
    },
    resize: function() {
      this.isPortrait = window.innerHeight > window.innerWidth;
      this.baseLength = window.innerHeight * .6;
      m.redraw();
    },
    change: function( text ) {
      this.value = text;
    },
    save: function() {
      localStorage.PlayGroundData = JSON.stringify(this.value);
      this.needsUpdate = true;
      this.isOpenedEditor = false;
      m.redraw();
    },
    updated: function() {
      this.needsUpdate = false;
    },
    openDoc: function() {
      this.isCloseDoc = 0;
    },
    closeDoc: function() {
      this.isCloseDoc = 1;
    },
    openJ3Doc: function() {
      this.docSrc.j3 = "../document/";
      this.currentDoc = "j3";
      this.openDoc();
    },
    openMiDoc: function() {
      this.docSrc.mithril = this.language === "ja" ? "http://mithril-ja.js.org/" : "https://mithril.js.org/";
      this.currentDoc = "mithril";
      this.openDoc();
    },
    create: function() {
      delete localStorage.PlayGroundData;
      this.value = null;
      this.idAdmin( "./" );
      this.save();
    },
    share: function( e ) {
      e.pass = localStorage.PlayGroundPass;
      e.id = this.idAdmin();
      m.request({ method: "POST", url: "./works/", data: e }).then( function( e ) {
        if ( !e.error ) {
          this.idAdmin( e.id );
          localStorage.PlayGroundPass = e.pass;
          this.openQR();
        }
      }.bind( this ));
    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    var vm = App.vm;

    return <div id="root">
      <div class="frame" style={{ width: vm.isPortrait ? "100%" : vm.baseLength + "px"}}>
        <div class="frame" style={{ height: "auto", bottom: vm.baseLength + "px"}}>
          <a id="logo" href="../" title="Solufa">
            <img src="../img/logoClear.png"/>
          </a>
          <img id="editIcon" src="./img/edit.png" onclick={vm.toggleEditor.bind( vm )} style={{ display: vm.isPortrait ? "block" : "none" }}/>
          <h1>PlayGround</h1>
          <div id="sns"><SnsBtn/></div>
          <div class="docBtn" style="left: 10%;" onclick={vm.openJ3Doc.bind(vm)}>
            <img class="doc1" src="img/doc1.png"/>
            <img class="doc0" src="img/doc0.png"/>
            Solufa
          </div>
          <div class="docBtn" style="right: 10%;" onclick={vm.openMiDoc.bind(vm)}>
            <img class="doc1" src="img/doc1.png"/>
            <img class="doc0" src="img/doc0.png"/>
            Mithril
          </div>
        </div>
        <div class="frame" style={ vm.isPortrait ? { left: "50%", marginLeft: -.5 * vm.baseLength + "px", width: vm.baseLength + "px", height: vm.baseLength + "px", top: "auto", bottom: 0 } : { height: vm.baseLength + "px", top: "auto", bottom: 0 }} config={ vm.updated.bind( vm)} >
          <Viewer id="viewer" src="../viewer/" onshare={ vm.share.bind(vm)} scripts={ vm.scripts} value={ vm.value || vm.defaultValue} needsUpdate={ vm.needsUpdate}/>
        </div>
        <div id="document" class="frame" style={{ left: -100 * vm.isCloseDoc + "%"}}>
          <div class="close" onclick={ vm.closeDoc.bind( vm)}><div/></div>
          <div class="iframe">
            <iframe src={ vm.docSrc.j3} style={{ display: vm.currentDoc === "j3" ? "block" : "none"}}/>
            <iframe src={ vm.docSrc.mithril} style={{ display: vm.currentDoc === "mithril" ? "block" : "none"}}/>
          </div>
        </div>
      </div>
      <div class="frame" style={ vm.isPortrait ? { top: "70px", height: "auto", bottom: 0, display: vm.isOpenedEditor ? "block" : "none" } : { width: "auto", left: vm.baseLength + "px", right: 0 }}>
        <Editor id="editor" oncreate={vm.create.bind( vm)} onsave={vm.save.bind( vm)} onchange={ vm.change.bind( vm)} value={ vm.value || vm.defaultValue}/>
      </div>
      <SnsScript/>
      <QRcode display={vm.displayQR} onclose={vm.closeQR.bind(vm)}/>
    </div>;
  }
};

m.mount( document.getElementById( "app" ), App );
