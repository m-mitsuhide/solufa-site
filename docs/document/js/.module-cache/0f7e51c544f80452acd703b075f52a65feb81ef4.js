var Home = {
  vm: {
    data: null,
    menu: null,
    isPortrait: false,
    baseLength: 260,
    article: null,
    isOpenedMenu: false,
    toggleMenu: function() {
      this.isOpenedMenu = !this.isOpenedMenu;
    },
    init: function() {
      window.addEventListener( "resize", this.resize.bind( this ), false );
      this.resize();

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
      this.getArticle();
      this.isOpenedMenu = false;
    },
    getArticle: function() {
      this.article = m.request({
        method: "GET",
        deserialize: function(value) {return value;},
        url: m.route.param( "category" ) && m.route.param( "article" )
          ? "./article/" + m.route.param( "category" ) + "/" + m.route.param( "article" ) + ".html"
          : "./article/function/solufa.html"
      });
    },
    highlight: function( target ) {
      Array.prototype.forEach.call( target.querySelectorAll("pre code"), hljs.highlightBlock　);
    }
  },
  controller: function() {
    Home.vm.init();
  },
  view: function() {
    var vm = Home.vm;
    var menu = vm.menu();
    var article = vm.article();

    return {tag: "div", attrs: {id:"root"}, children: [
      {tag: "div", attrs: {id:"header"}, children: [
        {tag: "a", attrs: {class:"home", href:"../"}, children: [
          {tag: "img", attrs: {src:"../img/logoBlack.png"}}
        ]}, 
        {tag: "img", attrs: {class:"menuIcon", src:"../img/menu.png", onclick:vm.toggleMenu.bind(vm), style:{ display: vm.isPortrait ? "block" : "none"}}}
      ]}, 
      {tag: "div", attrs: {class:"frame", style:{ width: vm.isPortrait ? "100%" : vm.baseLength + "px"}}, children: [
        m.component(Menu, {list:menu, onselect:vm.select.bind( vm)})
      ]}, 
      {tag: "div", attrs: {class:"frame", style: vm.isPortrait ? { left: 0, width: "100%", display: vm.isOpenedMenu ? "none" : "block" } : { left: vm.baseLength + "px" }}, children: [
        {tag: "div", attrs: {id:"article", config: vm.highlight}, children: [m.trust( article)]}
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
