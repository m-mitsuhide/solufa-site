var Home = {
  vm: {
    data: null,
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
    var vm = Home.vm;
    var json = vm.data();

    return {tag: "div", attrs: {}, children: [ json.tag
    ]};
  }
};

m.route.mode = "pathname";

m.route( document.getElementById( "app" ), "/jThreeLP/document/", {
  "/jThreeLP/document/": Home
});
