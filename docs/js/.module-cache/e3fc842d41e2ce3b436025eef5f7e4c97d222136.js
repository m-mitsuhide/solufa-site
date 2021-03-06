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
        {tag: "div", attrs: {id:"mithril"}, children: ["Made with", m.trust("&emsp;"), {tag: "a", attrs: {class:"italic", href:"http://mithril.js.org/", target:"_brank"}, children: [{tag: "span", attrs: {}, children: ["○"]}, " Mithril"]}]}
      ]}, 
      {tag: "div", attrs: {id:"features"}, children: [
        {tag: "div", attrs: {}, children: [
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Speed"]}, 
            {tag: "div", attrs: {}, children: [
              "Surprisingly lightly draw." + ' ' +
              "Be displayed 10,000 a cube, also read the 3D data." + ' ' +
              "The difference of 0.01s determines the success."
            ]}
          ]}, 
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Simple"]}, 
            {tag: "div", attrs: {}, children: [
              "Beautiful structure can be seen at a glance." + ' ' +
              "Robust components and simple notation." + ' ' +
              "The first line is the success of the application."
            ]}
          ]}, 
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Smart"]}, 
            {tag: "div", attrs: {}, children: [
              "To minimize the consumption of power." + ' ' +
              "Draw only frame a change has occurred." + ' ' +
              "Best provide a mobile experience."
            ]}
          ]}
        ]}
      ]}, 
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
