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

    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {id:"header"}, children: [
        {tag: "img", attrs: {src:"../img/logo.png"}}
      ]}, 
     json.tag
    ]};
  }
};

m.route.mode = "pathname";
var path = "/jThreeLP/document/";

m.route( document.getElementById( "app" ), "/jThreeLP/document/", {
  "/jThreeLP/document/": Home
});
