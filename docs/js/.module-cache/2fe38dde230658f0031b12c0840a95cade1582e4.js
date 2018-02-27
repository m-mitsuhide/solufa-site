var Editor = {
  vm: {
    init: function( e ) {
console.log(this,e)
    }
  },
  view: function( a, data ) {
    return {tag: "div", attrs: {id: data.id, config:vm.init}
    };
  }
};
