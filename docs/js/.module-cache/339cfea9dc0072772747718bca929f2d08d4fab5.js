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
        {tag: "div", attrs: {class:"frame"}
        }, 
        {tag: "div", attrs: {class:"frame"}
        }
      ]}, 
      {tag: "div", attrs: {class:"frame"}
      }
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
