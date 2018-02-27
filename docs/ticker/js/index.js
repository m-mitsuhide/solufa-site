var App = {
  vm: {
    backOpacity: 0,
    isPortrait: false,
    init: function() {
      window.addEventListener( "scroll", function() {
        this.backOpacity = Math.min( window.pageYOffset / window.innerHeight, 1 ) * .5;
        m.redraw();
      }.bind( this ), false );

      var fn = function( e ) {
        this.isPortrait = window.innerHeight > window.innerWidth;
        m.redraw();
      }.bind( this );
      window.addEventListener( "resize", fn, false );
      setTimeout( fn, 0 );
    },
    canvasInit: function( elem, isInit ) {
      if ( isInit ) return;

      for(s=window.screen,M=Math.random,p=[],i=0;i<256;p[i++]=1);
      setInterval('9Style=\'rgba(0,0,0,.05)\'9Rect(0,0,w,h)9Style=\'#0F0\';p.map(function(v,i){9Text(M()>=.5?1:0,i*10,v);p[i]=v>758+M()*1e4?0:v+10})'.split(9).join(';q.getContext(\'2d\').fill'),
      25 );

      var fn = function() {
        var size = App.vm.isPortrait ? 1 : 2;
        w=q.width=s.width/size;
        h=q.height=s.height/size;
      };

      window.addEventListener( "resize", fn, false );
      setTimeout( fn, 0 );
    }
  },
  controller: function() {
    App.vm.init();

    return {
      list: [
        {
          name: "jQuery",
          id: "jquery",
          version: "v2.2.4",
          normal: 257.6,
          minify: 85.6,
          ticker: 63.7
        },
        {
          name: "Backbone.js",
          id: "backbone",
          version: "v1.3.3",
          normal: 72.2,
          minify: 23.4,
          ticker: 16.0
        },
        {
          name: "React",
          id: "react",
          version: "v15.1.0",
          normal: 668.8,
          minify: 147.1,
          ticker: 101.2
        },
        {
          name: "Vue.js",
          id: "vue",
          version: "v1.0.24",
          normal: 270.9,
          minify: 76.3,
          ticker: 57.0
        },
        {
          name: "AngularJS",
          id: "angular",
          version: "v1.5.6",
          normal: 1155.2,
          minify: 158.9,
          ticker: 116.9
        },
        {
          name: "D3.js",
          id: "d3",
          version: "v3.5.17",
          normal: 337.9,
          minify: 151.7,
          ticker: 120.4
        },
        {
          name: "Cannon.js",
          id: "cannon",
          version: "v0.6.2",
          normal: 393.5,
          minify: 132.2,
          ticker: 87.9
        },
        {
          name: "Solufa",
          id: "solufa",
          version: "v0.3.1",
          normal: 1397.2,
          minify: 680.9,
          ticker: 484.6
        },
      ],
      basicStyle: { marginTop: "30px" },
      leftStyle: { float: "left", width: "48.5%", marginTop: "3%", marginRight: "1.5%" },
      rightStyle: { float: "left", width: "48.5%", marginTop: "3%", marginLeft: "1.5%" },
      ondrop: function( files ) {
        var data = new FormData;
        for ( var i = 0; i < files.length; i++ ) {
          data.append( "script[" + i + "]", files[ i ] );
        }
        var xhr = new XMLHttpRequest;
        xhr.open( "POST", "https://tickerjs.herokuapp.com/" );
        xhr.onreadystatechange = function( e ) {
          if ( this.readyState === 4 ) {
            if ( this.status === 200 ) {
              var blob = new Blob([this.response]);
              var url = window.URL || window.webkitURL;
              var blobURL = url.createObjectURL(blob);

              var a = document.createElement('a');
              a.download = this.getResponseHeader("Content-Disposition").match( /"(.+)"/)[ 1 ];
              a.href = blobURL;
              a.click();
            } else {
              alert( "Sorry, server or network error." );
            }
          }
        };
        xhr.responseType = 'arraybuffer';
        xhr.send( data );
      }
    };
  },
  view: function( ctrl ) {
    var vm = App.vm;

    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {id:"back"}, children: [{tag: "div", attrs: {style:{opacity: vm.backOpacity}}}]}, 
      {tag: "div", attrs: {id:"top", class:"white", style:{ height: window.innerHeight + "px"}}, children: [
        {tag: "div", attrs: {style:{ opacity: 1 - vm.backOpacity * 3}}, children: [
          {tag: "h1", attrs: {id:"main-title"}, children: ["T I C K E R"]}, 
          {tag: "div", attrs: {id:"sub-title"}, children: ["Powerful compressor for JavaScript"]}
        ]}
      ]}, 
      {tag: "canvas", attrs: {id:"q", config: vm.canvasInit}}, 
      {tag: "div", attrs: {id:"drop", class:"white"}, children: [
        m.component(DropArea, {ondrop: ctrl.ondrop.bind( ctrl)}), 
        SnsBtn
      ]}, 
      {tag: "div", attrs: {id:"features"}, children: [
        {tag: "div", attrs: {}, children: [
           ctrl.list.map( function( data, idx)   {return {tag: "div", attrs: {class:"feature", style: vm.isPortrait ? ctrl.basicStyle : idx % 2 === 0 ? ctrl.leftStyle : ctrl.rightStyle}, children: [
            {tag: "h2", attrs: {class:"white"}, children: [data.name]}, 
            {tag: "div", attrs: {}, children: [
              {tag: "table", attrs: {}, children: [
                {tag: "tbody", attrs: {}, children: [
                  /*<tr>
                    <td>Normal</td>
                    <td>
                      <span class="bar" style={{ width: "65%"}}/><span>{data.normal}KB</span>
                    </td>
                  </tr>*/
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["Minify"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "65%"}}}, {tag: "span", attrs: {}, children: [data.minify, "KB"]}
                    ]}
                  ]}, 
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["TICKER"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: data.ticker / data.minify * 65 + "%"}}}, {tag: "span", attrs: {}, children: [data.ticker, "KB"]}
                    ]}
                  ]}
                ]}
              ]}, 
              {tag: "h3", attrs: {}, children: [{tag: "a", attrs: {class:"download", href: "download/" + data.id + "-" + data.version + ".zip"}, children: [
                data.version, " zip"
              ]}]}
              ]}
          ]};})
        ]}
      ]}, 
      {tag: "h1", attrs: {id:"message", class:"white"}, children: ["Power to change the world."]}, 
      {tag: "div", attrs: {id:"footer", class:"white"}, children: [
        "T I C K E R"
      ]}, 
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
