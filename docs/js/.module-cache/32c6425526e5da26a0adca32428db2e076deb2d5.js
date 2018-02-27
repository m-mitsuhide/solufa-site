var Editor = {
  vm: {
    init: function( e ) {
console.log(this.attrs.id)
    }
  },
  view: function( a, data ) {
    var vm = Editor.vm;
    return {tag: "div", attrs: {id: data.id, config:vm.init}
    };
  }
};
