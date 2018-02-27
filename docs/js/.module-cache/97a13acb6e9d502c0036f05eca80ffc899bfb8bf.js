var App = {
  vm: {
    baseLength: 0,
    isPortrait: false,
    init: function() {
      window.addEventListener( "resize", this.resize.bind( this ), false );
      this.resize();
    },
    resize: function() {
      this.isPortrait = window.innerHeight > window.innerWidth;
      this.baseLength = window.innerHeight * .6;
      m.redraw();
    },
    save: function( text ) {
      console.log(text);
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
        {tag: "div", attrs: {class:"frame", style:{ height: vm.baseLength + "px", top: "auto", bottom: 0}}
        }
      ]}, 
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", height: window.innerHeight + "px" } : { width: "auto", left: vm.baseLength + "px", right: 0 }}, children: [
        m.component(Editor, {id:"editor", onsave:vm.save.bind( vm)})
      ]}
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
