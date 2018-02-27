var ua = navigator.userAgent.toUpperCase();

var App = {
  vm: {
    scripts: { version: 7, src: [ "Solufa.min.js", "Solufa-ObjMtl.js", "Solufa-OrbitVp.js", "Solufa-StereoVp.js", "Solufa-JyroSync.js", "MSXTransformer.js" ] },
    baseLength: 0,
    language: (window.navigator.languages && window.navigator.languages[0]) ||
      window.navigator.language ||
      window.navigator.userLanguage ||
      window.navigator.browserLanguage,
    isMobile: ua.indexOf('IPHONE') != -1 || (ua.indexOf('ANDROID') != -1 && ua.indexOf('MOBILE') != -1),
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
      xhr.open( "get", "default.js?0" );
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

    return {tag: "div", attrs: {id:"root", class: vm.isMobile ? "mobile" : ""}, children: [
      {tag: "div", attrs: {class:"frame", style:{ width: vm.isMobile ? "100%" : vm.baseLength + "px"}}, children: [
        {tag: "div", attrs: {class:"frame", style:{ height: "auto", bottom: "60%"}}, children: [
          {tag: "a", attrs: {id:"logo", href:"../", title:"Solufa"}, children: [
            {tag: "img", attrs: {src:"../img/logoClear.png"}}
          ]}, 
          {tag: "img", attrs: {id:"editIcon", src:"./img/edit.png", onclick:vm.toggleEditor.bind( vm), style:{ display: vm.isMobile ? "block" : "none"}}}, 
          {tag: "h1", attrs: {}, children: ["PlayGround"]}, 
          {tag: "div", attrs: {id:"sns"}, children: [SnsBtn]}, 
          {tag: "div", attrs: {class:"docBtn", style:"left: 10%;", onclick:vm.openJ3Doc.bind(vm)}, children: [
            {tag: "img", attrs: {class:"doc1", src:"img/doc1.png"}}, 
            {tag: "img", attrs: {class:"doc0", src:"img/doc0.png"}}, 
            "Solufa"
          ]}, 
          {tag: "div", attrs: {class:"docBtn", style:"right: 10%;", onclick:vm.openMiDoc.bind(vm)}, children: [
            {tag: "img", attrs: {class:"doc1", src:"img/doc1.png"}}, 
            {tag: "img", attrs: {class:"doc0", src:"img/doc0.png"}}, 
            "Mithril"
          ]}
        ]}, 
        {tag: "div", attrs: {class:"frame", style:{ height: "auto", top: "40%", bottom: 0}, config: vm.updated.bind( vm) }, children: [
          m.component(Viewer, {id:"viewer", src:"../viewer/", isMobile: vm.isMobile, onshare: vm.share.bind(vm), scripts: vm.scripts, value: vm.value || vm.defaultValue, needsUpdate: vm.needsUpdate})
        ]}, 
        {tag: "div", attrs: {id:"document", class:"frame", style:{ left: -100 * vm.isCloseDoc + "%"}}, children: [
          {tag: "div", attrs: {class:"close", onclick: vm.closeDoc.bind( vm)}, children: [{tag: "div", attrs: {}}]}, 
          {tag: "div", attrs: {class:"iframe"}, children: [
            {tag: "iframe", attrs: {src: vm.docSrc.j3, style:{ display: vm.currentDoc === "j3" ? "block" : "none"}}}, 
            {tag: "iframe", attrs: {src: vm.docSrc.mithril, style:{ display: vm.currentDoc === "mithril" ? "block" : "none"}}}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"frame", style: vm.isMobile ? { top: "70px", height: "auto", bottom: 0, display: vm.isOpenedEditor ? "block" : "none" } : { width: "auto", left: vm.baseLength + "px", right: 0 }}, children: [
        m.component(Editor, {id:"editor", oncreate:vm.create.bind( vm), onsave:vm.save.bind( vm), onchange: vm.change.bind( vm), value: vm.value || vm.defaultValue})
      ]}, 
      SnsScript, 
      m.component(QRcode, {display:vm.displayQR, onclose:vm.closeQR.bind(vm)})
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
