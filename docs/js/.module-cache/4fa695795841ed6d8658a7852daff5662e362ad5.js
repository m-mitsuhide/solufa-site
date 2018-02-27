var App = {
  vm: {
    baseLength: 0,
    isPortrait: false,
    json: { value: "" },
    needsUpdate: true,
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
          {tag: "div", attrs: {class:"docBtn", style:"left: 10%;"}, children: [{tag: "span", attrs: {}}, "jThree"]}, 
          {tag: "div", attrs: {class:"docBtn", style:"right: 10%;"}, children: [{tag: "span", attrs: {}}, "Mithril"]}
        ]}, 
        {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { left: "50%", marginLeft: -.5 * vm.baseLength + "px", width: vm.baseLength + "px", height: vm.baseLength + "px", top: "auto", bottom: 0 } : { height: vm.baseLength + "px", top: "auto", bottom: 0 }, config: vm.updated.bind( vm) }, children: [
          m.component(Viewer, {id:"viewer", value: vm.json.value, needsUpdate: vm.needsUpdate})
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
