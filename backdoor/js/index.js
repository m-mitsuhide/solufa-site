var ua = navigator.userAgent.toUpperCase();
var isMobile = ua.indexOf('IPHONE') != -1 || (ua.indexOf('ANDROID') != -1 && ua.indexOf('MOBILE') != -1);

var scrolled = false;
window.addEventListener( "scroll", function() {
  var flag = !!window.pageYOffset;
  if ( flag !== scrolled ) {
    scrolled = flag;
    m.redraw();
  }
}, false );

var App = {
  controller: function() {
    return {
      number: m.request({ method: "GET", url: "https://backdoor.herokuapp.com/userData.json?" + Date.now() })
    };
  },
  view: function( ctrl ) {

    return {tag: "div", attrs: {class: isMobile ? "mobile" : "pc"}, children: [
      {tag: "div", attrs: {id:"header", class: scrolled ? "scrolling" : "", style:{ display: "none"}}, children: [
        {tag: "div", attrs: {id:"title"}, children: ["BackDooR"]}
      ]}, 
      {tag: "div", attrs: {id:"top", style:{ height: window.innerHeight + "px"}}, children: [
        {tag: "div", attrs: {id:"top-blur"}}, 
        {tag: "div", attrs: {}, children: [
          {tag: "h1", attrs: {}, children: ["BackDooR"]}, 
          {tag: "h2", attrs: {}, children: ["仮想世界を繋ぐ秘密のドア"]}, 
          SnsBtn
        ]}, 

        {tag: "div", attrs: {id:"playing_number"}, children: [
        "現在", {tag: "span", attrs: {}, children: [ ctrl.number().current]}, "人/",  ctrl.number().total, "人がプレイ中"
        ]}
      ]}, 

      {tag: "div", attrs: {id:"features", class:"container"}, children: [
        {tag: "div", attrs: {}, children: [
          {tag: "h3", attrs: {}, children: ["ダウンロード不要"]}, 
          {tag: "img", attrs: {src:"img/browser.png"}}, 
          {tag: "div", attrs: {}, children: [
            "PCもスマホもウェブブラウザで楽しめます。" + ' ' +
            "VRモードはダンボールデバイスがあればOK。" + ' ' +
            "今すぐ楽しめてSNSでのシェアも簡単です。"
          ]}
        ]}, 
        {tag: "div", attrs: {}, children: [
          {tag: "h3", attrs: {}, children: ["軽量・高速描画"]}, 
          {tag: "img", attrs: {src:"img/solufa.jpg"}}, 
          {tag: "div", attrs: {}, children: [
            "国産ライブラリ「", {tag: "a", attrs: {href:"http://solufa.io/", target:"_brank"}, children: ["Solufa"]}, "」で開発しました。" + ' ' +
            "ウェブブラウザで軽快に動作するのが特徴。" + ' ' +
            "格安スマホやネットブックでもストレスなく遊べます。"
          ]}
        ]}, 
        {tag: "div", attrs: {}, children: [
          {tag: "h3", attrs: {}, children: ["”非”言語対話"]}, 
          {tag: "img", attrs: {src:"img/player.jpg"}}, 
          {tag: "div", attrs: {}, children: [
            "共有空間に言語コミュニケーションはありません。" + ' ' +
            "人種・国籍・文化の違いを超えて体験を共有できる。" + ' ' +
            "WebVR新時代の始まりです。"
          ]}
        ]}
      ]}, 

      {tag: "div", attrs: {id:"device"}, children: [
        {tag: "h3", attrs: {}, children: ["モードを選択"]}, 
        {tag: "div", attrs: {class:"container"}, children: [
          {tag: "div", attrs: {id:"pc"}, children: [{tag: "a", attrs: {href:"../backdoor_play/", target:"_brank"}, children: ["Monoral"]}]}, 
          {tag: "div", attrs: {id:"vr"}, children: [{tag: "a", attrs: {href:"../backdoor_play/?vr=1", target:"_brank"}, children: ["Stereo"]}, 
            {tag: "div", attrs: {id:"waiting"}, children: [{tag: "span", attrs: {}, children: ["Coming soon?"]}]}
          ]}
        ]}
      ]}, 

      {tag: "div", attrs: {id:"footer"}, children: ["BackDooR"]}, 
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
