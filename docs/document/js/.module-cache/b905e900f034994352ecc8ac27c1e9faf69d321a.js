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
    var article = data.data;

    return {tag: "div", attrs: {id:"article"}, children: [m.trust(article)
    ]};
  }
};
