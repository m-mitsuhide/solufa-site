var App = {
  vm: {
    baseLength: 0,
    isPortrait: false,
    json: { value: "" },
    needsUpdate: true,
    isCloseDoc: 1,
    currentDoc: "",
    docSrc: {
      j3: "",
      mithril: ""
    },
    init: function() {
      window.addEventListener( "resize", this.resize.bind( this ), false );
      this.resize();
    },
    resize: function() {
      this.isPortrait = window.innerHeight > window.innerWidth;
      this.baseLength = window.innerHeight * .6;
      m.redraw();
    },
    change: function( text ) {
      this.json.value = text;
    },
    save: function( text ) {
      this.needsUpdate = true;
      m.redraw();
    },
    updated: function() {
      this.needsUpdate = false;
    },
    openDoc: function() {
      this.isCloseDoc = 0;
    },
    openJ3Doc: function() {
      this.docSrc.j3 = "../document/";
      this.currentDoc = "j3";
      this.openDoc();
    },
    openMiDoc: function() {
      this.docSrc.mithril = "http://mithril.js.org/getting-started.html";
      this.currentDoc = "mithril";
      this.openDoc();
    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    var vm = App.vm;

    return {tag: "div", attrs: {id:"root", style: vm.isPortrait ? {} : { position: "fixed" }}, children: [
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", width: "100%", height: window.innerHeight + "px" } : { width: vm.baseLength + "px"}}, children: [
        {tag: "div", attrs: {class:"frame", style:{ height: "auto", bottom: vm.baseLength + "px"}}, children: [
          {tag: "a", attrs: {id:"logo", href:"../", title:"jThree.io"}, children: [{tag: "img", attrs: {src:"../img/logo.png"}}]}, 
          {tag: "h1", attrs: {}, children: ["PlayGround"]}, 
          {tag: "div", attrs: {id:"sns"}, children: [SnsBtn]}, 
          {tag: "div", attrs: {class:"docBtn", style:"left: 10%;", onclick:vm.openJ3Doc.bind( vm)}, children: [
            {tag: "img", attrs: {class:"doc1", src:"img/doc1.png"}}, 
            {tag: "img", attrs: {class:"doc0", src:"img/doc0.png"}}, "jThree"
          ]}, 
          {tag: "div", attrs: {class:"docBtn", style:"right: 10%;", onclick:vm.openMiDoc.bind( vm)}, children: [
            {tag: "img", attrs: {class:"doc1", src:"img/doc1.png"}}, 
            {tag: "img", attrs: {class:"doc0", src:"img/doc0.png"}}, "Mithril"
          ]}
        ]}, 
        {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { left: "50%", marginLeft: -.5 * vm.baseLength + "px", width: vm.baseLength + "px", height: vm.baseLength + "px", top: "auto", bottom: 0 } : { height: vm.baseLength + "px", top: "auto", bottom: 0 }, config: vm.updated.bind( vm) }, children: [
          m.component(Viewer, {id:"viewer", value: vm.json.value, needsUpdate: vm.needsUpdate})
        ]}, 
        {tag: "div", attrs: {id:"document", class:"frame", style:{ left: -100 * vm.isCloseDoc + "%"}}, children: [
          {tag: "iframe", attrs: {src: vm.docSrc.j3, style:{ display: vm.currentDoc === "j3" ? "block" : "none"}}}, 
          {tag: "iframe", attrs: {src: vm.docSrc.mithril, style:{ display: vm.currentDoc === "mithril" ? "block" : "none"}}}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", height: window.innerHeight + "px" } : { width: "auto", left: vm.baseLength + "px", right: 0 }}, children: [
        m.component(Editor, {id:"editor", onsave:vm.save.bind( vm), onchange: vm.change.bind( vm), value: vm.json.value})
      ]}, 
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
