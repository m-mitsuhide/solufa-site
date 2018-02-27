var SnsScript = {
  controller: function() {

  },
  view: function() {
    return m( "div", [
      m( "script", 'window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));' ),
      m( "script", '(function(d, s, id) {  var js, fjs = d.getElementsByTagName(s)[0];  if (d.getElementById(id)) return;  js = d.createElement(s); js.id = id;  js.src = "//connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v2.5&appId=947710718600470";  fjs.parentNode.insertBefore(js, fjs);}(document, "script", "facebook-jssdk"));' ),
      m( "div#fb-root", { style: { display: "none" } } ),
    ]);
  }
};

var SnsBtn = {
  controller: function() {

  },
  view: function() {
    return m( "div.sns", [
      m( "div.fb-share-button", { "data-href": "http://jthree.io/", "data-layout": "button_count" } ),
      m( "a.twitter-share-button", { href: "https://twitter.com/share", "data-dnt": "true" } )
    ]);
  }
};


var App = {
  vm: {
    rotation: false,
    backOpacity: 0,
    isLandscape: true,
    init: function() {
      window.addEventListener( "scroll", function( e ) {
        console.log(window.pageYOffset)
      }, false );
    }
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    var vm = App.vm;

    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {id:"back"}, children: [{tag: "div", attrs: {}}, {tag: "div", attrs: {style:{opacity: vm.backOpacity}}}]}, 
      {tag: "div", attrs: {id:"header"}, children: [
        {tag: "img", attrs: {src:"img/logo.png"}}, 
        {tag: "a", attrs: {class:"link", href:"playground/"}, children: ["PlayGround"]}, 
        {tag: "a", attrs: {class:"link", href:"document/"}, children: ["Document"]}, 
        {tag: "a", attrs: {class:"link", href:"github/"}, children: ["GitHub"]}
      ]}, 
      {tag: "div", attrs: {id:"top", class:"white", style:{ height: window.innerHeight + "px"}}, children: [
        {tag: "h1", attrs: {id:"main-title", class:"italic"}, children: ["jThree 0.1.0 Sol"]}, 
        {tag: "div", attrs: {id:"sub-title"}, children: ["Speed, Simple and Smart Web3D/VR Library"]}, 
        SnsBtn, 
        {tag: "div", attrs: {class:"mithril"}, children: ["Made with", m.trust("&emsp;"), {tag: "a", attrs: {href:"http://mithril.js.org/", target:"_brank"}, children: [{tag: "span", attrs: {}, children: ["○"]}, " Mithril"]}]}
      ]}, 
      {tag: "div", attrs: {id:"features"}, children: [
        {tag: "div", attrs: {}, children: [
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Speed"]}, 
            {tag: "div", attrs: {class:"text"}, children: [
              "Surprisingly lightly draw in mobile.", {tag: "br", attrs: {}}, 
              "Be displayed 10,000 a cube, also read the 3D data.", {tag: "br", attrs: {}}, 
              "The difference of 0.01s determines the success."
              /*驚くほど軽快に描画する。
キューブを1万個表示しても、３Dデータを読み込んでも。
0.1秒の差が成功を決める。*/
            ]}
          ]}, 
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Simple"]}, 
            {tag: "div", attrs: {class:"text"}, children: [
              "Beautiful structure can be seen at a glance.", {tag: "br", attrs: {}}, 
              "Robust components and simple notation.", {tag: "br", attrs: {}}, 
              "The first line is the success of the application."
              /*一目でわかる美しい構造。
堅牢なコンポーネントと簡易な記法。
その1行がアプリケーションを成功させる。*/
            ]}
          ]}, 
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Smart"]}, 
            {tag: "div", attrs: {class:"text"}, children: [
              "To minimize the consumption of power.", {tag: "br", attrs: {}}, 
              "Draw only frame a change has occurred.", {tag: "br", attrs: {}}, 
              "Best provide a mobile experience."
              /*電力の消費を最小限に抑える。
変更が起きたフレームだけ描画する。
最高のモバイル体験を提供。*/
            ]}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {id:"sample"}, children: [
        {tag: "img", attrs: {id:"snippet", src:"img/code.png"}}, 
        {tag: "div", attrs: {id:"demo"}, children: [
          {tag: "div", attrs: {}, children: [
            {tag: "div", attrs: {class: "device" + ( vm.rotation ? " rotation" : "")}, children: [
              {tag: "img", attrs: {class:"phone", src:"./img/iphone.png"}}, 
              {tag: "div", attrs: {id:"jthree", class: "viewer" + ( vm.isLandscape ? " landscape" : "")}}
            ]}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {id:"usage"}, children: [
        {tag: "div", attrs: {id:"document"}, children: [
          {tag: "span", attrs: {class:"white"}, children: ["Document"]}, 
          {tag: "div", attrs: {}, children: [{tag: "a", attrs: {class:"btn-gr", href:"document/"}, children: [{tag: "img", attrs: {src:"img/logo.png"}}]}]}, 
          {tag: "div", attrs: {class:"mithril"}, children: [{tag: "a", attrs: {class:"btn-gr", href:"http://mithril.js.org/getting-started.html", target:"_brank"}, children: [{tag: "span", attrs: {}, children: ["○"]}, " Mithril"]}]}
        ]}, 
        {tag: "div", attrs: {id:"download"}, children: [
          {tag: "span", attrs: {class:"white"}, children: ["Get Code"]}, 
          {tag: "div", attrs: {}, children: [{tag: "a", attrs: {class:"btn-gr", href:"download/"}, children: ["ZIP v0.1.0"]}]}
        ]}
      ]}, 
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
