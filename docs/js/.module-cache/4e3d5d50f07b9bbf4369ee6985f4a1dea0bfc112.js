var Home = {
  vm: {
    data: null,
    isPortrait: false,
    baseLength: 300,
    init: function() {
      window.addEventListener( "resize", this.resize.bind( this ), false );
      this.resize();

      this.data = m.request({
        method: "GET",
        url: "json/home.json"
      });
    },
    resize: function() {
      this.isPortrait = window.innerHeight > window.innerWidth;
      m.redraw();
    },
  },
  controller: function() {
    Home.vm.init();
  },
  view: function() {
    var vm = Home.vm;
    var json = vm.data();

    return {tag: "div", attrs: {id:"root", style: vm.isPortrait ? {} : { position: "fixed" }}, children: [
      {tag: "div", attrs: {id:"header"}, children: [
        {tag: "a", attrs: {class:"home", href:"../"}, children: [
          {tag: "img", attrs: {src:"../img/jthree-logo.svg"}}, 
          {tag: "img", attrs: {src:"../img/jthree-name.svg"}}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"frame left", style: vm.isPortrait ? { position: "relative", width: "100%", height: window.innerHeight - 50 + "px" } : { bottom: 0, width: vm.baseLength + "px"}}
      }, 
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", height: window.innerHeight - 50 + "px" } : { bottom: 0, width: "auto", left: vm.baseLength + "px", right: 0 }}
      }, 
     json.tag
    ]};
  }
};

m.route.mode = "pathname";
var path = "/jThreeLP/document/";

m.route( document.getElementById( "app" ), "/jThreeLP/document/", {
  "/jThreeLP/document/": Home
});
