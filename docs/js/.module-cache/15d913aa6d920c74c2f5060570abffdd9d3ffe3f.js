var Editor = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    Editor.vm.init();
  },
  view: function( a, data ) {console.log(data);
    return {tag: "div", attrs: {}
    };
  }
};
