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
    var article = data.article;
    console.log(article)

    return {tag: "div", attrs: {id:"article"}
    };
  }
};
