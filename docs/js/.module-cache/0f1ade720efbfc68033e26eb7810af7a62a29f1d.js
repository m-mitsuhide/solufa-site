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
        {tag: "a", attrs: {class:"home", href:"../"}, children: [
          {tag: "img", attrs: {src:"../img/jthree-logo.svg", height:"160"}}, 
          {tag: "img", attrs: {src:"../img/jthree-name.svg", height:"160"}}
        ]}
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
