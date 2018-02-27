var timer = {
  start: function() {
    this._start = Date.now();
  },
  end: function( text ) {
    this.elem.innerText = text + " " + ( Date.now() - this._start ) + "ms";
  },
  _start: 0,
  elem: function() {
    var div = document.createElement( "div" );
    div.setAttribute( "style", "color: #000; font-size: 200%; position: fixed; bottom: 10px; left: 0; width: 100%; text-align: center;" );
    window.addEventListener( "DOMContentLoaded", function() {
      document.body.appendChild( div );
      div = null;
    }, false );
    return div;
  }()
};
