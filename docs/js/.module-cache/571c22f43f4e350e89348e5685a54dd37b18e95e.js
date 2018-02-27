var App = {
  vm: {
    baseLength: 0,
    init: function() {
      window.addEventListener( "resize", this.resize.bind( this ), false );
      this.resize();
    },
    resize: function() {
      this.baseLength = window.innerHeight * .6;
      m.redraw();
    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    var vm = App.vm;

    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {class:"frame", style:{ width: vm.baseLength + "px"}}, children: [
        {tag: "div", attrs: {class:"frame", style:{ height: "auto", bottom: vm.baseLength + "px"}}
        }, 
        {tag: "div", attrs: {class:"frame", style:{ height: vm.baseLength + "px", top: "auto", bottom: 0}}
        }
      ]}, 
      {tag: "div", attrs: {class:"frame", style:{ left: vm.baseLength + "px", right: 0}}
      }
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
