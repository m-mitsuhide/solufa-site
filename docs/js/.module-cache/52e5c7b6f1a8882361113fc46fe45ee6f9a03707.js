var Editor = {
  vm: {
    id: "",
    init: function( e ) {
      this.id = e.id;
console.log(this.id)
    }
  },
  view: function( a, data ) {
    var vm = Editor.vm;
    return {tag: "div", attrs: {id: data.id, config:vm.init.bind( vm)}
    };
  }
};
