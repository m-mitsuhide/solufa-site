var SnsScript = {
  controller: function() {

  },
  view: function() {
    return {tag: "div", attrs: {}, children: [
      {tag: "script", attrs: {}, children: [ m.trust( 'window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));')]}, 
      {tag: "script", attrs: {}, children: [ m.trust( '(function(d, s, id) {  var js, fjs = d.getElementsByTagName(s)[0];  if (d.getElementById(id)) return;  js = d.createElement(s); js.id = id;  js.src = "//connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v2.5&appId=947710718600470";  fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));')]}, 
      {tag: "div", attrs: {id:"fb-root", style:{ display: "none"}}}
    ]};
  }
};

var SnsBtn = {
  controller: function() {

  },
  view: function( a, data ) {
    return {tag: "div", attrs: {class: "sns" + ( data && data.mode === "goal" ? ".fixed" : ""), style:{ display: !data || /(vrmode|goal)/.test( data.mode ) ? "block" : "none"}}, children: [
      {tag: "div", attrs: {class:"shadow", style:{ display: data && data.mode === "goal" ? "block" : "none", paddingBottom: "5px"}}, children: ["この爽快感を友達にシェア！"]}, 
      {tag: "div", attrs: {class:"fb-share-button", "data-href":"http://unicoaster.net", "data-layout":"button_count"}}, 
      {tag: "a", attrs: {class:"twitter-share-button", href:"https://twitter.com/share", "data-dnt":"true"}}
    ]};
  }
};

var App = {
  vm: {
    isPortrait: null,
    windowHeight: 0,
    data: m.prop( { uu: 0, distance: 0 } ),
    init: function() {
      this.resize();
      this.getJson();
    },
    getJson: function() {
      m.request( { method: "get", url: "http://bridge-note.com/coaster/data.json?" + Date.now() } ).then( this.data ).then( function() {
        setTimeout( this.getJson.bind( this ), 2000 );
      }.bind( this ));
    },
    resize: function() {
      var isPortrait = window.innerHeight > window.innerWidth;
      if ( this.isPortrait !== isPortrait ) {
        this.windowHeight = window.innerHeight;
        this.isPortrait = isPortrait;
        m.startComputation();
        m.endComputation();
      }
    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    var vm = App.vm;
    var blockStyle = { minHeight: vm.windowHeight + "px" };
    var quartBlockStyle = { height: vm.windowHeight / 4 + "px" };

    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {id:"back"}, children: [
        {tag: "div", attrs: {}}
      ]}, 
      {tag: "div", attrs: {id:"top", class:"block", style: blockStyle }, children: [
        {tag: "h1", attrs: {class:"title"}, children: [
          {tag: "p", attrs: {class:"main"}, children: ["Hitofude Coaster"]}, 
          {tag: "p", attrs: {class:"sub"}, children: ["指一本で軽快に駆け抜ける無限の世界"]}, 
          SnsBtn
        ]}, 
        {tag: "div", attrs: {class:"result shadow"}, children: ["これまで",  vm.data().uu.toLocaleString(), "名で", {tag: "span", attrs: {style:{ fontSize: "150%", color: "#ff0", fontWeight: "bold"}}, children: [ vm.data().distance.toLocaleString() ]}, "万kmのコースを作りました。"]}
      ]}, 
      {tag: "div", attrs: {style: quartBlockStyle }}, 
      {tag: "div", attrs: {class:"intro block", style: blockStyle }, children: [
        {tag: "div", attrs: {class:"image", style:{ backgroundImage: "url(img/intro0.png)"}}, children: [
          {tag: "div", attrs: {class:"text"}, children: ["コースを書いて"]}
        ]}
      ]}, 
      {tag: "div", attrs: {style: quartBlockStyle }}, 
      {tag: "div", attrs: {class:"intro block", style: blockStyle }, children: [
        {tag: "div", attrs: {class:"image", style:{ backgroundImage: "url(img/intro1.png)"}}, children: [
          {tag: "div", attrs: {class:"text"}, children: ["かざすと走る！"]}
        ]}
      ]}, 
      {tag: "div", attrs: {style: quartBlockStyle }}, 
      {tag: "div", attrs: {class:"intro block", style: blockStyle }, children: [
        {tag: "div", attrs: {class:"image", style:{ backgroundImage: "url(img/intro2.jpg)"}}, children: [
          {tag: "div", attrs: {class:"text", style:{ bottom: "auto", top: "5%"}}, children: ["かぶると飛び出す！"]}
        ]}
      ]}, 
      {tag: "div", attrs: {style:{ overflow: "hidden", position: "relative", minHeight: vm.windowHeight + "px"}}, children: [m.component(Player, {height: vm.windowHeight})]}, 
      SnsScript
    ]};
  }
};

window.addEventListener( "resize", App.vm.resize.bind( App.vm ), false );

m.mount( document.getElementById( "app" ), App );
