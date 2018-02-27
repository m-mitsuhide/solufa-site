var Home = {
  vm: {
    data: null,
    menu: null,
    isPortrait: false,
    baseLength: 260,
    article: null,
    init: function() {
      window.addEventListener( "resize", this.resize.bind( this ), false );
      this.resize();

      this.data = m.request({
        method: "GET",
        url: "json/home.json"
      });

      this.menu = m.request({
        method: "GET",
        url: "json/menu.json"
      });

      this.getArticle();
    },
    resize: function() {
      this.isPortrait = window.innerHeight > window.innerWidth;
      m.redraw();
    },
    select: function( e ) {
      m.route( "./?category=" + e.category + "&article=" + e.article );
    },
    getArticle: function() {
      this.article = m.request({
        method: "GET",
        url: m.route.param( "category" ) && m.route.param( "article" )
          ? "./json/" + m.route.param( "category" ) + "/" + m.route.param( "article" ) + ".json"
          : "./json/home.json"
      });
    }
  },
  controller: function() {
    Home.vm.init();
  },
  view: function() {
    var vm = Home.vm;
    var json = vm.data();
    var menu = vm.menu();
    var article = vm.article();

    return {tag: "div", attrs: {id:"root", style: vm.isPortrait ? {} : { position: "fixed" }}, children: [
      {tag: "div", attrs: {id:"header"}, children: [
        {tag: "a", attrs: {class:"home", href:"../"}, children: [
          {tag: "img", attrs: {src:"../img/jthree-logo.svg"}}, 
          {tag: "img", attrs: {src:"../img/jthree-name.svg"}}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", width: "100%", height: window.innerHeight - 50 + "px" } : { bottom: 0, width: vm.baseLength + "px"}}, children: [
        m.component(Menu, {list:menu, onselect:vm.select.bind( vm)})
      ]}, 
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { position: "relative", height: window.innerHeight - 50 + "px" } : { bottom: 0, width: "auto", left: vm.baseLength + "px", right: 0 }}, children: [
        m.component(Article, {data:article})
      ]}
    ]};
  }
};

m.route.mode = "pathname";

m.route( document.getElementById( "route" ), "./" + location.search, {
  "./": {
    view: function() {
      return {tag: "div", attrs: {}};
    }
  }
});

m.mount( document.getElementById( "app" ), Home );
