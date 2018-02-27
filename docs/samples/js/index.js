var ua = navigator.userAgent.toUpperCase();
var isMobile = ua.indexOf('IPHONE') != -1 || (ua.indexOf('ANDROID') != -1 && ua.indexOf('MOBILE') != -1);
var App = {
  controller: function() {
    return {
      toggleMenu: function() {
        this.isOpenedMenu = !this.isOpenedMenu;
      },
      menu: m.request({
        method: "GET",
        url: "json/menu.json"
      }),
      click: function( value ) {
        m.route( "./?id=" + value );
        this.url = "../playground/?id=" + value;
        this.isOpenedMenu = false;
      },
      url: isMobile ? "" : location.search ? "../playground/?id=" + location.search.split( "=" )[ 1 ] : "",
      isOpenedMenu: true,
      isMobile: isMobile
    };
  },
  view: function( ctrl ) {

    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {id:"header"}, children: [
        {tag: "a", attrs: {class:"home", href:"../"}, children: [
          {tag: "img", attrs: {src:"../img/logoBlack.png"}}
        ]}, 
        {tag: "img", attrs: {class:"menuIcon", src:"../img/menu.png", onclick: ctrl.toggleMenu.bind( ctrl), style:{ display: ctrl.isMobile ? "block" : "none"}}}
      ]}, 
      {tag: "div", attrs: {id:"menu", class:"frame", style:{ width: ctrl.isMobile ? "100%" : "200px"}}, children: [
         ctrl.menu().map( function(li)  {return {tag: "div", attrs: {}, children: [
          {tag: "span", attrs: {class:"title"}, children: [li.title]}, 
          {tag: "div", attrs: {class:"list"}, children: [
          li.child.map( function(child)  {return {tag: "div", attrs: {value:child.article, onclick:m.withAttr( "value", ctrl.click.bind( ctrl ))}, children: [ child.title]};})
          ]}
        ]};})
      ]}, 
      {tag: "div", attrs: {class:"frame", style: ctrl.isMobile ? { left: 0, width: "100%", display: ctrl.isOpenedMenu ? "none" : "block" } : { left: "200px" }}, children: [
        {tag: "iframe", attrs: {src: ctrl.url, frameborder:"0", allowfullscreen:true}}
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

m.mount( document.getElementById( "app" ), App );
