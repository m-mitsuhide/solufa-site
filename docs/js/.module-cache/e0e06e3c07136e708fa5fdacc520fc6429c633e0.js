var Viewer = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    Viewer.vm.init();
  },
  view: function( a, data ) {
    var vm = Viewer.vm;console.log(data.value)

    return {tag: "div", attrs: {id: data.id}
    };
  }
};
