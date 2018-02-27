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

    return <div>
      <div id="back"><div/><div style={{opacity: vm.backOpacity}}/></div>
      <div id="header">
        <img src="img/logoClear.png"/>
        <a class="link" href="playground/">PlayGround</a>
        <a class="link" href="document/">Document</a>
        <a class="link" href="https://github.com/amatelus/solufa/" target="_brank">GitHub</a>
      </div>
      <div id="top" class="white" style={{ height: window.innerHeight + "px"}}>
        <div style={{ opacity: 1 - vm.backOpacity * 3 }}>
          <h1 id="main-title" class="italic">Solufa v0.1.0</h1>
          <div id="sub-title">Speed, Small and Scalable Web3D/VR Library</div>
        </div>
        <SnsBtn/>
        <div class="mithril">Made with{m.trust("&emsp;")}<a href="http://mithril.js.org/" target="_brank"><span>○</span> Mithril</a></div>
      </div>
      <div id="features">
        <div>
          <div class="feature">
            <h2 class="white italic">Speed</h2>
            <div class="speed">
              <h3>Loading</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Solufa</td>
                    <td>
                      <span class="bar" style={{ width: "32%"}}/><span>306ms</span>
                    </td>
                  </tr>
                  <tr>
                    <td>A-Frame</td>
                    <td>
                      <span class="bar" style={{ width: "60%"}}/><span>574ms</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="speed">
              <h3>Rendering</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Solufa</td>
                    <td>
                      <span class="bar" style={{ width: "19%"}}/><span>1.06s</span>
                    </td>
                  </tr>
                  <tr>
                    <td>A-Frame</td>
                    <td>
                      <span class="bar" style={{ width: "60%"}}/><span>3.29s</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="speed">
              <h3>Refresh</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Solufa</td>
                    <td>
                      <span class="bar" style={{ width: "27%"}}/><span>20ms</span>
                    </td>
                  </tr>
                  <tr>
                    <td>A-Frame</td>
                    <td>
                      <span class="bar" style={{ width: "60%"}}/><span>44ms</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="feature" config={vm.resize.bind( vm )} style={{ float: "left", width: "48.75%", marginTop: "2.5%", marginRight: "1.25%" }}>
            <h2 class="white italic">Small</h2>
            <div>
              <h3>File size (minify)</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Solufa</td>
                    <td>
                      <span class="bar" style={{ width: "60%"}}/><span>664KB</span>
                    </td>
                  </tr>
                  <tr>
                    <td>A-Frame</td>
                    <td>
                      <span class="bar" style={{ width: "65%"}}/><span>720KB</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3>Memory usage</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Solufa</td>
                    <td>
                      <span class="bar" style={{ width: "39%"}}/><span>98MB</span>
                    </td>
                  </tr>
                  <tr>
                    <td>A-Frame</td>
                    <td>
                      <span class="bar" style={{ width: "65%"}}/><span>165MB</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="feature" style={{ height: vm.scalableHeight + "px", float: "left", width: "48.75%", marginTop: "2.5%", marginLeft: "1.25%" }}>
            <h2 class="white italic">Scalable</h2>
            <h3 id="scalable">Combination of<p>"Virtual DOM"</p>with<p>"Solufa DOM"</p></h3>
          </div>
        </div>
      </div>
      <div id="sample">
        <div>
          <pre id="snippet">
          <code config={vm.highlight}>{vm.sample()}</code>
          </pre>
          <div id="demo">
            <div>
              <div class={ "device" + ( vm.rotation ? " rotation" : "")}>
                <img class="phone" src="./img/iphone.png"/>
                <div class={ "viewer" + ( vm.isLandscape ? " landscape" : "")}>
                  <iframe id="solufa"/>
                  <div class="thumbnail" style={{ display: vm.isViewerOpen ? "none" : "block" }} onclick={ vm.viewerOpen.bind( vm )}>
                    <div class="play">
                      <div class="arrow"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="usage">
        <div id="playground">
          <div>
            <a class="btn-gr" href="playground/">PlayGround</a>
            <div id="works">
            { vm.worksList().slice( 0, 30 ).map( ( list, idx ) => <a class={ idx % 5 % 2 ? "down" : ""} href={"./playground/?id=" + list.id} target="_brank" style={{ backgroundImage: "url(./playground/works/" + list.id + "/thumbnail.jpg)"}}/>)}
            </div>
          </div>
        </div>
        <div>
          <a class="btn-gr" href="https://github.com/amatelus/solufa/" target="_brank">GitHub</a>
          <a class="btn-gr" href="https://github.com/amatelus/solufa/archive/master.zip">Download ZIP</a>
          <a class="btn-gr" href="document/" target="_brank">Document</a>
        </div>
      </div>
      <div id="footer">
        Solufa v0.1.0
      </div>
      <SnsScript/>
    </div>;
  }
};

m.mount( document.getElementById( "app" ), App );
