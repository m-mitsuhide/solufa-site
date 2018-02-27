var Graph = {
  view: function( ctrl, attr ) {
    var data = attr.data;

    return {tag: "div", attrs: {}, children: [
      {tag: "h3", attrs: {}, children: [ data.label]},
      {tag: "table", attrs: {}, children: [
        {tag: "tbody", attrs: {}, children: [
           data.row.map( function(row)  {return {tag: "tr", attrs: {}, children: [
            {tag: "td", attrs: {}, children: [ row.name]},
            {tag: "td", attrs: {}, children: [
              {tag: "span", attrs: {class:"bar", style:{ width: 60 * row.value / data.max + "%"}}}, {tag: "span", attrs: {}, children: [ row.value + data.unit]}
            ]}
          ]};}
          )
        ]}
      ]}
    ]};
  }
};

var App = {
  vm: {
    rotation: false,
    backOpacity: 0,
    isPortrait: false,
    worksList: null,
    sample: null,
    isViewerOpen: false,
    scalableHeight: 0,
    init: function() {
      window.addEventListener( "scroll", function() {
        this.backOpacity = Math.min( window.pageYOffset / window.innerHeight, 1 ) * .7;
        m.redraw();
      }.bind( this ), false );

      this.worksList = m.request({
        method: "GET",
        url: "./playground/works/worksList.json?" + Date.now()
      });

      this.sample = m.request({
        method: "GET",
        url: "./sample.html",
        deserialize: function(value) {return value;}
      });
    },
    highlight: function( target, isInit ) {
      if ( isInit) return;
      hljs.highlightBlock( target );
    },
    viewerOpen: function() {
      this.isViewerOpen = true;
      var doc = document.getElementById( "solufa" ).contentDocument;
      doc.open();
      doc.write( this.sample() );
      doc.close();
    },
    resize: function( elem, isInit ) {
      var fn = function( e ) {
        this.scalableHeight = e.offsetHeight;
        this.isPortrait = window.innerHeight > window.innerWidth;
        m.redraw();
      }.bind( this, elem );
      window.addEventListener( "resize", fn, false );
      setTimeout( fn, 0 );
    },
    speedData: [
      {
        label: "Loading",
        unit: "ms",
        max: 399,
        row: [
          {
            name: "Solufa",
            value: 127
          },
          {
            name: "A-Frame",
            value: 399
          }
        ]
      },
      {
        label: "Rendering",
        unit: "s",
        max: 3.02,
        row: [
          {
            name: "Solufa",
            value: 0.86
          },
          {
            name: "A-Frame",
            value: 3.02
          }
        ]
      },
      {
        label: "Refresh",
        unit: "ms",
        max: 44,
        row: [
          {
            name: "Solufa",
            value: 20
          },
          {
            name: "A-Frame",
            value: 44
          }
        ]
      },
    ],
    smallData: [
      {
        label: "File size",
        unit: "KB",
        max: 861,
        row: [
          {
            name: "Solufa",
            value: 447
          },
          {
            name: "A-Frame",
            value: 861
          }
        ]
      },
      {
        label: "Memory usage",
        unit: "MB",
        max: 165,
        row: [
          {
            name: "Solufa",
            value: 98
          },
          {
            name: "A-Frame",
            value: 165
          }
        ]
      },
    ]
  },
  controller: function() {
    App.vm.init();
  },
  view: function() {
    var vm = App.vm;

    return {tag: "div", attrs: {}, children: [
      {tag: "div", attrs: {id:"back"}, children: [{tag: "div", attrs: {}}, {tag: "div", attrs: {style:{opacity: vm.backOpacity}}}]},
      {tag: "div", attrs: {id:"header"}, children: [
        {tag: "img", attrs: {src:"img/logoClear.png"}},
        {tag: "a", attrs: {class:"link", href:"samples/"}, children: ["Samples"]},
        {tag: "a", attrs: {class:"link", href:"playground/"}, children: ["PlayGround"]},
        {tag: "a", attrs: {class:"link", href:"document/"}, children: ["Document"]},
        {tag: "a", attrs: {class:"link", href:"https://github.com/amatelus/solufa/", target:"_brank"}, children: ["GitHub"]}
      ]},
      {tag: "div", attrs: {id:"top", class:"white", style:{ height: window.innerHeight + "px"}}, children: [
        {tag: "div", attrs: {style:{ opacity: 1 - vm.backOpacity * 3}}, children: [
          {tag: "h1", attrs: {id:"main-title", class:"italic"}, children: ["Solufa v0.6.2"]}, 
          {tag: "div", attrs: {id:"sub-title"}, children: ["Speed, Small and Scalable Web3D/VR Library"]}
        ]},
        SnsBtn,
        {tag: "div", attrs: {class:"mithril"}, children: ["Made with", m.trust("&emsp;"), {tag: "a", attrs: {href:"http://mithril.js.org/", target:"_brank"}, children: [{tag: "span", attrs: {}, children: ["○"]}, " Mithril"]}]}
      ]},
      {tag: "div", attrs: {id:"features"}, children: [
        {tag: "div", attrs: {}, children: [
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Speed"]},
             vm.speedData.map( function(data)  {return {tag: "div", attrs: {class:"speed", style: vm.isPortrait ? {} : { width: "33.333%", float: "left" }}, children: [
              m.component(Graph, {data: data })
            ]};})
          ]},
          {tag: "div", attrs: {class:"feature", config:vm.resize.bind( vm), style: vm.isPortrait ? { marginTop: "30px" } : { float: "left", width: "48.75%", marginTop: "2.5%", marginRight: "1.25%" }}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Small"]},
             vm.smallData.map( function(data)  {return m.component(Graph, {data: data });})
          ]},
          {tag: "div", attrs: {class:"feature", style: vm.isPortrait ? { marginTop: "30px" } : { height: vm.scalableHeight + "px", float: "left", width: "48.75%", marginTop: "2.5%", marginLeft: "1.25%" }}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Scalable"]},
            {tag: "h3", attrs: {id:"scalable"}, children: ["Combination of", {tag: "p", attrs: {}, children: ["\"Virtual DOM\""]}, "with", {tag: "p", attrs: {}, children: ["\"Solufa DOM\""]}]}
          ]}
        ]}
      ]},
      {tag: "div", attrs: {id:"sample"}, children: [
        {tag: "div", attrs: {style:{ paddingTop: vm.isPortrait ? "150%" : "50%"}}, children: [
          {tag: "pre", attrs: {id:"snippet"}, children: [
            {tag: "code", attrs: {config:vm.highlight}, children: [vm.sample()]}
          ]},
           vm.isPortrait ? null
          : {tag: "div", attrs: {id:"demo"}, children: [
            {tag: "div", attrs: {}, children: [
              {tag: "div", attrs: {class: "device" + ( vm.rotation ? " rotation" : "")}, children: [
                {tag: "img", attrs: {class:"phone", src:"./img/iphone.png"}},
                {tag: "div", attrs: {class:"viewer"}, children: [
                  {tag: "iframe", attrs: {id:"solufa"}},
                  {tag: "div", attrs: {class:"thumbnail", style:{ display: vm.isViewerOpen ? "none" : "block"}, onclick: vm.viewerOpen.bind( vm)}, children: [
                    {tag: "div", attrs: {class:"play"}, children: [
                      {tag: "div", attrs: {class:"arrow"}}
                    ]}
                  ]}
                ]}
              ]}
            ]}
          ]}
        ]}
      ]},
      {tag: "div", attrs: {id:"usage"}, children: [
        {tag: "div", attrs: {style: vm.isPortrait ? { marginBottom: "30px" } : { width: "290px", float: "left", position: "relative" }}, children: [
          {tag: "a", attrs: {class:"btn-gr", href:"https://github.com/amatelus/solufa/", target:"_brank"}, children: ["GitHub"]},
          {tag: "a", attrs: {class:"btn-gr", href:"https://github.com/amatelus/solufa/archive/master.zip"}, children: ["Download ZIP"]},
          {tag: "a", attrs: {class:"btn-gr", href:"document/", target:"_brank"}, children: ["Document"]},
          {tag: "a", attrs: {class:"twitter-timeline", "data-theme":"dark", href:"https://twitter.com/solufa_js"}, children: ["Tweets by solufa_js"]}, " ", {tag: "script", attrs: {async:true,src:"//platform.twitter.com/widgets.js", charset:"utf-8"}}
        ]},
        {tag: "div", attrs: {id:"playground", style: vm.isPortrait ? {} : { float: "left", marginLeft: "-290px" }}, children: [
          {tag: "div", attrs: {style: vm.isPortrait ? {} : { marginLeft: "330px" }}, children: [
            {tag: "a", attrs: {class:"btn-gr", href:"samples/"}, children: ["Samples"]},
            {tag: "a", attrs: {class:"btn-gr", href:"playground/"}, children: ["PlayGround"]},
            {tag: "div", attrs: {id:"works"}, children: [
             vm.worksList().slice( 0, 30 ).map( function( list, idx)   {return {tag: "a", attrs: {class: idx % 5 % 2 ? "down" : "", href:"./playground/?id=" + list.id, target:"_brank", style:{ backgroundImage: "url(./playground/works/" + list.id + "/thumbnail.jpg)"}}};})
            ]}
          ]}
        ]}
      ]},
      {tag: "h1", attrs: {id:"message", class:"white"}, children: ["Speed to change the world."]},
      {tag: "div", attrs: {id:"footer"}, children: [
        "Solufa"
      ]},
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
