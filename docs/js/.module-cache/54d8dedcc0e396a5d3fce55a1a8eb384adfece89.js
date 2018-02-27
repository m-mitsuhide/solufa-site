var App = {
  vm: {
    baseLength: 0,
    isPortrait: false,
    json: { value: "" },
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
      this.json.value = text;
      m.redraw();
    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    var vm = App.vm;

    return {tag: "div", attrs: {id:"root", style: vm.isPortrait ? {} : { position: "fixed" }}, children: [
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", width: "100%", height: window.innerHeight + "px" } : { width: vm.baseLength + "px"}}, children: [
        {tag: "div", attrs: {class:"frame", style:{ height: "auto", bottom: vm.baseLength + "px"}}
        }, 
        {tag: "div", attrs: {class:"frame", style:{ height: vm.baseLength + "px", top: "auto", bottom: 0}}, children: [
          m.component(Viewer, {id:"viewer", value: vm.json.value})
        ]}
      ]}, 
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", height: window.innerHeight + "px" } : { width: "auto", left: vm.baseLength + "px", right: 0 }}, children: [
        m.component(Editor, {id:"editor", onsave:vm.save.bind( vm), onchange: vm.change.bind( vm), value: vm.json.value})
      ]}
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
