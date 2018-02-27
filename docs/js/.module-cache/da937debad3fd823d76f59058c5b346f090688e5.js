var App = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    return {tag: "div", attrs: {}
    };
  }
};

m.mount( document.getElementById( "app" ), App );
