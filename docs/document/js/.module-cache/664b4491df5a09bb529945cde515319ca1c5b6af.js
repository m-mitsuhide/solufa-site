var Article = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    Article.vm.init();
  },
  view: function( a, data ) {
    var vm = Article.vm;

    return {tag: "div", attrs: {id:"article"}
    };
  }
};
