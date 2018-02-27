var Home = {
  vm: {
    data: m.prop({}),
    init: function() {
      this.data = m.request({
        method: "GET",
        url: "json/home.json"
      });
    }
  },
  controller: function() {
    Home.vm.init();
  },
  view: function() {
    var vm = Home.vm;console.log(vm.data())
    return {tag: "div", attrs: {}, children: [ vm.data().tag
    ]};
  }
};


m.route( document.getElementById( "app" ), "/jThreeLP/document/", {
  "/jThreeLP/document/": Home
});
