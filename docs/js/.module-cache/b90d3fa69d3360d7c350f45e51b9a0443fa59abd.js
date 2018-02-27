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
      m( "div.fb-share-button", { "data-href": "http://unicoaster.net", "data-layout": "button_count" } ),
      m( "a.twitter-share-button", { href: "https://twitter.com/share", "data-dnt": "true" } )
    ]);
  }
};


var App = {
  view: function() {
    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {id:"back"}, children: [{tag: "div", attrs: {}}]}, 
      {tag: "div", attrs: {id:"header"}

      }, 
      {tag: "div", attrs: {id:"top", style:{ height: window.innerHeight + "px"}}, children: [
        {tag: "h1", attrs: {id:"main-title", class:"white"}, children: ["jThree 0.1.0 Sol"]}, 
        {tag: "div", attrs: {id:"sub-title", class:"white"}, children: ["Speed, Simple and Smart Web3D/VR Library"]}, 
        SnsBtn
      ]}, 
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
