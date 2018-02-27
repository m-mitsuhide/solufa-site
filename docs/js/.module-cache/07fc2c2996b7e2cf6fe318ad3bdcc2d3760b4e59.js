var App = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {class:"frame"}, children: [
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
