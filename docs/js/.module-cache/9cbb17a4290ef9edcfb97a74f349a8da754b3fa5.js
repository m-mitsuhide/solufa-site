var Editor = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    Editor.vm.init();
  },
  view: function( a, data ) {
    return {tag: "div", attrs: {id: data.id}
    };
  }
};
