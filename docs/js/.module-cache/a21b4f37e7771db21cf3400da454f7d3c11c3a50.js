var App = {
  vm: {
    rotation: false,
    backOpacity: 0,
    isLandscape: false,
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
        m.redraw();
      }.bind( this, elem );
      window.addEventListener( "resize", fn, false );
      fn();
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
        {tag: "img", attrs: {src:"img/logoClear.png"}}, 
        {tag: "a", attrs: {class:"link", href:"playground/"}, children: ["PlayGround"]}, 
        {tag: "a", attrs: {class:"link", href:"document/"}, children: ["Document"]}, 
        {tag: "a", attrs: {class:"link", href:"https://github.com/amatelus/solufa/", target:"_brank"}, children: ["GitHub"]}
      ]}, 
      {tag: "div", attrs: {id:"top", class:"white", style:{ height: window.innerHeight + "px"}}, children: [
        {tag: "div", attrs: {style:{ opacity: 1 - vm.backOpacity * 3}}, children: [
          {tag: "h1", attrs: {id:"main-title", class:"italic"}, children: ["Solufa v0.1.0"]}, 
          {tag: "div", attrs: {id:"sub-title"}, children: ["Speed, Small and Scalable Web3D/VR Library"]}
        ]}, 
        SnsBtn, 
        {tag: "div", attrs: {class:"mithril"}, children: ["Made with", m.trust("&emsp;"), {tag: "a", attrs: {href:"http://mithril.js.org/", target:"_brank"}, children: [{tag: "span", attrs: {}, children: ["○"]}, " Mithril"]}]}
      ]}, 
      {tag: "div", attrs: {id:"features"}, children: [
        {tag: "div", attrs: {}, children: [
          {tag: "div", attrs: {class:"feature"}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Speed"]}, 
            {tag: "div", attrs: {class:"speed"}, children: [
              {tag: "h3", attrs: {}, children: ["Loading"]}, 
              {tag: "table", attrs: {}, children: [
                {tag: "tbody", attrs: {}, children: [
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["Solufa"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "32%"}}}, {tag: "span", attrs: {}, children: ["306ms"]}
                    ]}
                  ]}, 
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["A-Frame"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "60%"}}}, {tag: "span", attrs: {}, children: ["574ms"]}
                    ]}
                  ]}
                ]}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"speed"}, children: [
              {tag: "h3", attrs: {}, children: ["Rendering"]}, 
              {tag: "table", attrs: {}, children: [
                {tag: "tbody", attrs: {}, children: [
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["Solufa"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "19%"}}}, {tag: "span", attrs: {}, children: ["1.06s"]}
                    ]}
                  ]}, 
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["A-Frame"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "60%"}}}, {tag: "span", attrs: {}, children: ["3.29s"]}
                    ]}
                  ]}
                ]}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"speed"}, children: [
              {tag: "h3", attrs: {}, children: ["Refresh"]}, 
              {tag: "table", attrs: {}, children: [
                {tag: "tbody", attrs: {}, children: [
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["Solufa"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "27%"}}}, {tag: "span", attrs: {}, children: ["20ms"]}
                    ]}
                  ]}, 
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["A-Frame"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "60%"}}}, {tag: "span", attrs: {}, children: ["44ms"]}
                    ]}
                  ]}
                ]}
              ]}
            ]}
          ]}, 
          {tag: "div", attrs: {class:"feature", config:vm.resize.bind( vm), style:{ float: "left", width: "48.75%", marginTop: "2.5%", marginRight: "1.25%"}}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Small"]}, 
            {tag: "div", attrs: {}, children: [
              {tag: "h3", attrs: {}, children: ["File size (minify)"]}, 
              {tag: "table", attrs: {}, children: [
                {tag: "tbody", attrs: {}, children: [
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["Solufa"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "60%"}}}, {tag: "span", attrs: {}, children: ["664KB"]}
                    ]}
                  ]}, 
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["A-Frame"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "65%"}}}, {tag: "span", attrs: {}, children: ["720KB"]}
                    ]}
                  ]}
                ]}
              ]}
            ]}, 
            {tag: "div", attrs: {}, children: [
              {tag: "h3", attrs: {}, children: ["Memory usage"]}, 
              {tag: "table", attrs: {}, children: [
                {tag: "tbody", attrs: {}, children: [
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["Solufa"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "39%"}}}, {tag: "span", attrs: {}, children: ["98MB"]}
                    ]}
                  ]}, 
                  {tag: "tr", attrs: {}, children: [
                    {tag: "td", attrs: {}, children: ["A-Frame"]}, 
                    {tag: "td", attrs: {}, children: [
                      {tag: "span", attrs: {class:"bar", style:{ width: "65%"}}}, {tag: "span", attrs: {}, children: ["165MB"]}
                    ]}
                  ]}
                ]}
              ]}
            ]}
          ]}, 
          {tag: "div", attrs: {class:"feature", style:{ height: vm.scalableHeight + "px", float: "left", width: "48.75%", marginTop: "2.5%", marginLeft: "1.25%"}}, children: [
            {tag: "h2", attrs: {class:"white italic"}, children: ["Scalable"]}, 
            {tag: "h3", attrs: {id:"scalable"}, children: ["Combination of", {tag: "p", attrs: {}, children: ["\"Virtual DOM\""]}, "with", {tag: "p", attrs: {}, children: ["\"Solufa DOM\""]}]}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {id:"sample"}, children: [
        {tag: "div", attrs: {}, children: [
          {tag: "pre", attrs: {id:"snippet"}, children: [
          {tag: "code", attrs: {config:vm.highlight}, children: [vm.sample()]}
          ]}, 
          {tag: "div", attrs: {id:"demo"}, children: [
            {tag: "div", attrs: {}, children: [
              {tag: "div", attrs: {class: "device" + ( vm.rotation ? " rotation" : "")}, children: [
                {tag: "img", attrs: {class:"phone", src:"./img/iphone.png"}}, 
                {tag: "div", attrs: {class: "viewer" + ( vm.isLandscape ? " landscape" : "")}, children: [
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
        {tag: "div", attrs: {id:"playground"}, children: [
          {tag: "div", attrs: {}, children: [
            {tag: "a", attrs: {class:"btn-gr", href:"playground/"}, children: ["PlayGround"]}, 
            {tag: "div", attrs: {id:"works"}, children: [
             vm.worksList().slice( 0, 30 ).map( function( list, idx)   {return {tag: "a", attrs: {class: idx % 5 % 2 ? "down" : "", href:"./playground/?id=" + list.id, target:"_brank", style:{ backgroundImage: "url(./playground/works/" + list.id + "/thumbnail.jpg)"}}};})
            ]}
          ]}
        ]}, 
        {tag: "div", attrs: {}, children: [
          {tag: "a", attrs: {class:"btn-gr", href:"https://github.com/amatelus/solufa/", target:"_brank"}, children: ["GitHub"]}, 
          {tag: "a", attrs: {class:"btn-gr", href:"https://github.com/amatelus/solufa/archive/master.zip"}, children: ["Download ZIP"]}, 
          {tag: "a", attrs: {class:"btn-gr", href:"document/", target:"_brank"}, children: ["Document"]}
        ]}
      ]}, 
      {tag: "div", attrs: {id:"footer"}, children: [
        "Solufa v0.1.0"
      ]}, 
      SnsScript
    ]};
  }
};

m.mount( document.getElementById( "app" ), App );
