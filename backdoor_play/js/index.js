var ua = navigator.userAgent.toUpperCase();
var isMobile = ua.indexOf('IPHONE') != -1 || (ua.indexOf('ANDROID') != -1 && ua.indexOf('MOBILE') != -1);
var node_host = "https://backdoor.herokuapp.com";// http://" + location.hostname + ":8080;

var switchState = {
  vertical: 0,
  rotation: 0,
  goback: 0,
  slide: 0,
  block: m.prop( false ),
  remove: m.prop( false ),
  home: false,
};

var urlQuery = {};
// pad: 0 || 1, type: "pc" || "vr"
location.search !== "" && location.search.replace( "?", "" ).split( "=" ).forEach( function( text, idx, data ) {
  if ( idx % 2 ) urlQuery[ data[ idx - 1 ] ] = text;
});

var socket = io.connect( node_host );
var dataArray = [];
var dataObject = {};
var userList = [];


// !function() {
//   var cache = [];
//   var time = 0;
//
//   function updateGamePad( result ) {
//     switchState.vertical = result.axes[ isMobile ? 1 : 3 ];
//     switchState.rotation = result.axes[ isMobile ? 0 : 2 ];
//     switchState.goback = result.axes[ isMobile ? 3 : 1 ];
//     switchState.slide = result.axes[ isMobile ? 2 : 0 ];
//
//     if ( !cache[ 0 ] && result.buttons[ 0 ] ) switchState.block( true );
//     if ( !cache[ 1 ] && result.buttons[ 1 ] ) switchState.remove( true );
//     if ( !cache[ 3 ] && result.buttons[ 3 ] ) switchState.home = true;
//     cache = result.buttons;
//   }
//
//   if ( urlQuery.vr !== undefined ) { // for mobile only
//     socket.on( "updateGamepad", function( data ) {
//       var result = data[ urlQuery.vr ];
//       result && updateGamePad( result );
//     });
//   } else {
//     S.update( gamepads({
//       onUpdate: function( data ) {
//         var result = data[ urlQuery.pad ];
//         result && updateGamePad( result );
//       }
//     }).update );
//   }
// }();


socket.on( "move", function( data ) {

  var indexList = {};
  userList.forEach( function( user, index ) {
    indexList[ user.id ] = index;
    if ( !--userList[ index ].life ) {
      delete userList[ index ];
    }
  });

  for ( var i = 0, l = data.length; i < l; i++ ) {
    if ( localStorage.backDoorId !== data[ i ].id ) {
      data[ i ].life = 10;
      if ( indexList[ data[ i ].id ] === undefined ) {
        userList.push( data[ i ] );
      } else {
        userList[ indexList[ data[ i ].id ] ] = data[ i ];
      }
    }
  }

  S.m.redraw();
});

function generateKey( block ) {
  return block[ 0 ] + "-" + block[ 1 ] + "-" + block[ 2 ];
}

function getRoomData( data ) {
  dataArray = data;
  dataObject = {};
  dataArray.forEach( function( block ) {
    dataObject[ generateKey( block ) ] = block;
    block[ 0 ] += .5;
    block[ 1 ] += .5;
    block[ 2 ] += .5;
  });
  window.m.redraw();
}

function changeBlock( block ) {
  var key = generateKey( block );
  var object = dataObject[ key ];

  block[ 0 ] += .5;
  block[ 1 ] += .5;
  block[ 2 ] += .5;

  if ( block.length === 4 ) { // add
    if ( object ) {
      object[ 0 ] = block[ 0 ];
      object[ 1 ] = block[ 1 ];
      object[ 2 ] = block[ 2 ];
      object[ 3 ] = block[ 3 ];
    } else {
      dataObject[ key ] = block;
      dataArray.push( block );
    }
  } else { // remove
    var index = dataArray.indexOf( object );
    if ( index !== -1 ) {
      delete dataObject[ key ];
      delete dataArray[ index ];
    }
  }
  S.m.redraw();
}

socket.on( "changeBlock", function( data ) {
  if ( localStorage.backDoorId === data.id ) return;
  data.forEach( changeBlock );
});


var mode = "corridor";

S( function() {
  m.mount( document.getElementById( "app" ), {
    controller: function() {
      var ctrl = {
        rightStart: function( e ) {
          e && e.preventDefault();
          switchState.slide = 1;
        },
        rightEnd: function() {
          switchState.slide = 0;
        },
        goStart: function( e ) {
          e && e.preventDefault();
          switchState.goback = -1;
        },
        goEnd: function() {
          switchState.goback = 0;
        },
        backStart: function( e ) {
          e && e.preventDefault();
          switchState.goback = 1;
        },
        backEnd: function() {
          switchState.goback = 0;
        },
        upStart: function( e ) {
          e && e.preventDefault();
          switchState.vertical = -1;
        },
        upEnd: function() {
          switchState.vertical = 0;
        },
        downStart: function( e ) {
          e && e.preventDefault();
          switchState.vertical = 1;
        },
        downEnd: function() {
          switchState.vertical = 0;
        },
        dStart: function( e ) {
          e && e.preventDefault();
          switchState.rotation = 1;
        },
        dEnd: function() {
          switchState.rotation = 0;
        },
        aStart: function( e ) {
          e && e.preventDefault();
          switchState.rotation = -1;
        },
        aEnd: function() {
          switchState.rotation = 0;
        },
        leftStart: function( e ) {
          e && e.preventDefault();
          switchState.slide = -1;
        },
        leftEnd: function() {
          switchState.slide = 0;
        },
        blockStart: function( e ) {
          e && e.preventDefault();
          if ( mode !== "main" ) return;
          switchState.block( true );
          S.m.redraw();
        },
        removeStart: function( e ) {
          e && e.preventDefault();
          if ( mode !== "main" ) return;
          switchState.remove( true );
          S.m.redraw();
        },
        homeStart: function( e ) {
          e && e.preventDefault();
          if ( mode !== "main" ) return;
          switchState.home = true;
        },
        fullscreen: function() {
          this.isFull = true;
          document.body.webkitRequestFullscreen && document.body.webkitRequestFullscreen();
        },
        isFull:false,
      };


      window.addEventListener( "keydown", function( e ) {

        if ( e.shiftKey ) {
          ctrl.blockStart();
          return;
        }

        switch ( e.keyCode ) {
        case 87:
          ctrl.goStart();
          break;
        case 83:
          ctrl.backStart();
          break;
        case 68:
          ctrl.rightStart();
          break;
        case 65:
          ctrl.leftStart();
          break;
        case 38:
          ctrl.upStart();
          break;
        case 40:
          ctrl.downStart();
          break;
        case 39:
          ctrl.dStart();
          break;
        case 37:
          ctrl.aStart();
          break;
        case 8:
          ctrl.homeStart();
          e.preventDefault();
          break;
        case 32:
          ctrl.removeStart();
          break;
        }
      }, false );
      window.addEventListener( "keyup", function( e ) {
        switch ( e.keyCode ) {
        case 87:
          ctrl.goEnd();
          break;
        case 83:
          ctrl.backEnd();
          break;
        case 68:
          ctrl.rightEnd();
          break;
        case 65:
          ctrl.leftEnd();
          break;
        case 38:
          ctrl.upEnd();
          break;
        case 40:
          ctrl.downEnd();
          break;
        case 39:
          ctrl.dEnd();
          break;
        case 37:
          ctrl.aEnd();
          break;
        }
      }, false );

      return ctrl;
    },
    view: function( ctrl ) {
      return {tag: "div", attrs: {}, children: [

        {tag: "div", attrs: {id:"switchBoxC", style:{ display: mode === "main" && !urlQuery.vr ? "block" : "none"}}, children: [
          {tag: "div", attrs: {class:"switch", style:{ right: "50%", marginRight: "5px", width: "auto", left: "25%", marginLeft: "25px"}, 
            onmousedown: ctrl.removeStart, ontouchstart: ctrl.removeStart}, children: [{tag: "span", attrs: {}, children: [ isMobile ? "" : "Space:", "remove"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ left: "50%", marginLeft: "5px", width: "auto", right: "25%", marginRight: "25px"}, 
            onmousedown: ctrl.homeStart, ontouchstart: ctrl.homeStart}, children: [{tag: "span", attrs: {}, children: [ isMobile ? "" : "BS:", "home"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ left: "15px"}, 
            onmousedown: ctrl.blockStart, ontouchstart: ctrl.blockStart}, children: [{tag: "span", attrs: {}, children: [ isMobile ? "" : "Shift:", "add"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ right: "15px"}, 
            onmousedown: ctrl.blockStart, ontouchstart: ctrl.blockStart}, children: [{tag: "span", attrs: {}, children: [ isMobile ? "" : "Shift:", "add"]}]}
        ]}, 

        {tag: "div", attrs: {id:"switchBoxA", style:{ display: urlQuery.vr ? "none" : "block"}}, children: [
          {tag: "div", attrs: {class:"switch", style:{ bottom: 0, left: "35%"}, 
            onmousedown: ctrl.backStart, onmouseup: ctrl.backEnd, ontouchstart: ctrl.backStart, ontouchend: ctrl.backEnd}, children: [{tag: "span", attrs: {}, children: ["S"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ top: 0, left: "35%"}, 
            onmousedown: ctrl.goStart, onmouseup: ctrl.goEnd, ontouchstart: ctrl.goStart, ontouchend: ctrl.goEnd}, children: [{tag: "span", attrs: {}, children: ["W"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ top: "35%", right: 0}, 
            onmousedown: ctrl.rightStart, onmouseup: ctrl.rightEnd, ontouchstart: ctrl.rightStart, ontouchend: ctrl.rightEnd}, children: [{tag: "span", attrs: {}, children: ["D"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ top: "35%", left: 0}, 
            onmousedown: ctrl.leftStart, onmouseup: ctrl.leftEnd, ontouchstart: ctrl.leftStart, ontouchend: ctrl.leftEnd}, children: [{tag: "span", attrs: {}, children: ["A"]}]}
        ]}, 

        {tag: "div", attrs: {id:"switchBoxB", style:{ display: urlQuery.vr ? "none" : "block"}}, children: [
          {tag: "div", attrs: {class:"switch", style:{ top: 0, left: "35%"}, 
            onmousedown: ctrl.upStart, onmouseup: ctrl.upEnd, ontouchstart: ctrl.upStart, ontouchend: ctrl.upEnd}, children: [{tag: "span", attrs: {}, children: ["↑"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ bottom: 0, left: "35%"}, 
            onmousedown: ctrl.downStart, onmouseup: ctrl.downEnd, ontouchstart: ctrl.downStart, ontouchend: ctrl.downEnd}, children: [{tag: "span", attrs: {}, children: ["↓"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ top: "35%", right: 0}, 
            onmousedown: ctrl.dStart, onmouseup: ctrl.dEnd, ontouchstart: ctrl.dStart, ontouchend: ctrl.dEnd}, children: [{tag: "span", attrs: {}, children: ["→"]}]}, 
          {tag: "div", attrs: {class:"switch", style:{ top: "35%", left: 0}, 
            onmousedown: ctrl.aStart, onmouseup: ctrl.aEnd, ontouchstart: ctrl.aStart, ontouchend: ctrl.aEnd}, children: [{tag: "span", attrs: {}, children: ["←"]}]}
        ]}, 

        {tag: "div", attrs: {class:"pointer", style:{ left: urlQuery.vr ? "24.5%" : "50%"}}}, 
        {tag: "div", attrs: {class:"pointer", style:{ right: "24.5%", display: urlQuery.vr ? "block" : "none"}}}, 

        {tag: "div", attrs: {id:"start", style:{ display: isMobile && !ctrl.isFull ? "block" : "none"}, onclick: ctrl.fullscreen.bind( ctrl) }, children: [
          {tag: "div", attrs: {style:{ left: urlQuery.vr ? "24.5%" : "50%"}}, children: ["START"]}, 
          {tag: "div", attrs: {style:{ left: "75.5%", display: urlQuery.vr ? "block" : "none"}}, children: ["START"]}
        ]}
      ]};
    }
  });
});

S( function( m ) {
  var commonData = {
    doorList: null,
    openedDoor: null,
    openedBackDoor: null,
    wallSphereTxr: {
      type: "image",
      src: "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAAACAkQBADs="
    },
    mainCamPos: null,
    backDoorPos: [ 0, 0, 0 ], // world pos
    firstVp: null,
    roomId: null,
  };


  window.onbeforeunload = function() {
    if ( commonData.roomId != null && localStorage.backDoorId ) {
      socket.emit( "leave", { roomId: commonData.roomId, id: localStorage.backDoorId });
    }
  };

  m.mount( S.document.body, {
    controller: function() {

      var areaLimit = {
        corridor: {
          r: 2.75
        },
        main: {
          x: 50,
          z: 50
        }
      };

      var roomLength = 10;
      var ceilingR = 1 / Math.tan( Math.PI / roomLength ); //http://wasan.hatenablog.com/entry/2015/09/12/124859

      return {
        lightStyle:{ pos: [0, 10,10 ] },
        wallGeo: {
          type: "PlaneBuffer",
          value: [ .5, 1 ]
        },
        wallMtl: {
          type: "MeshLambert",
          value: {
            color: "#999"
          }
        },
        wallSphereGeo: {
          type: "SphereBuffer",
          value: [ 100, 32, 32 ]
        },
        wallSphereMtl: {
          type: "MeshBasic",
          value: {
            map: commonData.wallSphereTxr,
            side: 2
          }
        },
        setDoorList: function( elem, isInit ) {
          if ( isInit ) return;
          commonData.doorList = elem.querySelectorAll( ".door" );
        },
        walk: function( elem, isInit ) {
          if ( isInit ) return;

          var jyro = elem.querySelector( "#jyro" );
          var jyro_quat = jyro.coreObject.quaternion;
          var vertical_cache = 0;
          var tmp_vec = new THREE.Vector3;
          var gobackMarker = elem.querySelector( "#gobackMarker" );
          var slideMarker = elem.querySelector( "#slideMarker" );
          var time = 0;

          S.update( function( delta ) {
            if ( switchState.home ) {

              elem.style.posX = commonData.backDoorPos[ 0 ] * 2;
              elem.style.posY = this.camHight.posY;
              elem.style.posZ = commonData.backDoorPos[ 2 ] * 2;
              switchState.home = false;
              commonData.mainCamPos = elem.style.pos;
              m.redraw();
            } else {

              if ( switchState.vertical ) {
                vertical_cache += switchState.vertical * delta * 1.5;
                vertical_cache = Math.max( -Math.PI / 2 + .001, Math.min( vertical_cache, Math.PI / 2 - .001 ) );
                jyro_quat.setFromAxisAngle( tmp_vec.set( -1, 0, 0 ), vertical_cache );
              }

              if ( switchState.rotation ) {
                elem.childNodes[ 0 ].style.rotateY -= delta * switchState.rotation;
              }

              if ( switchState.goback || switchState.slide ) {
                var camPos = elem.style.pos;
                var x, z, tmpX = camPos[ 0 ], tmpZ = camPos[ 2 ];
                var limit = areaLimit[ mode ];

                if ( switchState.goback ) {
                  var gobackMarkerPos = gobackMarker.style.worldPos;
                  x = gobackMarkerPos[ 0 ] - camPos[ 0 ];
                  z = gobackMarkerPos[ 2 ] - camPos[ 2 ];
                  var length = Math.sqrt( x * x + z * z ); // 極地を向いていても一定速度で進める

                  tmpX -= x / length * delta * switchState.goback * 2 * ( urlQuery.type !== "vr" && mode === "main" ? 2 : 1 );
                  tmpZ -= z / length * delta * switchState.goback * 2 * ( urlQuery.type !== "vr" && mode === "main" ? 2 : 1 );
                }

                if ( switchState.slide ) {
                  var slideMarkerPos = slideMarker.style.worldPos;
                  x = slideMarkerPos[ 0 ] - camPos[ 0 ];
                  z = slideMarkerPos[ 2 ] - camPos[ 2 ];

                  tmpX += x * delta * switchState.slide * 2 * ( urlQuery.type !== "vr" ? 2 : 1 );
                  tmpZ += z * delta * switchState.slide * 2 * ( urlQuery.type !== "vr" ? 2 : 1 );
                }

                if ( mode === "corridor" ) {
                  tmp_vec.set( tmpX, 0, tmpZ );
                  var L = tmp_vec.length();
                  if ( L >= limit.r ) {

                    if ( switchState.goback < 0 && commonData.openedDoor !== false ) { // go to main
                      commonData.roomId = commonData.openedDoor;
                      socket.emit( "join", { roomId: commonData.roomId, id: localStorage.backDoorId }, function( data ) {
                        localStorage.backDoorId = data.id;
                      });

                      m.request({method: "GET", url: node_host + "/roomData/room" + commonData.roomId + ".json?" + Date.now() })
                      .then( getRoomData );
                      mode = "main";

                    } else {
                      tmp_vec.divideScalar( L ).multiplyScalar( limit.r );
                      elem.style.posX = tmp_vec.x;
                      elem.style.posZ = tmp_vec.z;
                    }
                  } else {
                    elem.style.posX = tmpX;
                    elem.style.posZ = tmpZ;
                  }
                } else {
                  elem.style.posX = Math.min( limit.x, Math.max( -limit.x, tmpX ) );
                  elem.style.posZ = Math.min( limit.z, Math.max( -limit.z, tmpZ ) );
                }

              }

              if ( mode === "main" ) {

                //ブロックとの衝突判定
                var pos = elem.style.pos;
                var camX = Math.floor( pos[ 0 ] );
                var camY = Math.floor( pos[ 1 ] - .5 -.6 );// 初期のcamHightが.5になるように
                var camZ = Math.floor( pos[ 2 ] );

                if ( dataObject[ generateKey( [ camX, camY + 1, camZ ] ) ] ) { // 登れない衝突
                  var nearLargeXLength = Math.ceil( pos[ 0 ] ) - pos[ 0 ];
                  var nearSmallXLength = pos[ 0 ] - Math.floor( pos[ 0 ] );
                  var axisXLength = nearLargeXLength > nearSmallXLength ? nearSmallXLength : nearLargeXLength;

                  var nearLargeZLength = Math.ceil( pos[ 2 ] ) - pos[ 2 ];
                  var nearSmallZLength = pos[ 2 ] - Math.floor( pos[ 2 ] );
                  var axisZLength = nearLargeZLength > nearSmallZLength ? nearSmallZLength : nearLargeZLength;

                  if ( axisXLength < axisZLength ) {
                    elem.style.posX = Math[ nearLargeXLength > nearSmallXLength ? "floor" : "ceil" ]( pos[ 0 ] )
                      + ( nearLargeXLength > nearSmallXLength ? -.005 : .005 );
                  } else {
                    elem.style.posZ = Math[ nearLargeZLength > nearSmallZLength ? "floor" : "ceil" ]( pos[ 2 ] )
                      + ( nearLargeZLength > nearSmallZLength ? -.005 : .005 );
                  }
                } else if ( dataObject[ generateKey( [ camX, camY, camZ ] ) ] ) { // 登れる衝突
                  elem.style.posY += 1;
                } else if ( camY >= 1 && !dataObject[ generateKey( [ camX, camY - 1, camZ ] ) ] ) { // 落下判定
                  if ( camY !== 1 && !dataObject[ generateKey( [ camX, camY - 2, camZ ] ) ] )
                  { // 降りれない
                    elem.style.posX = Math.min( Math.ceil( camPos[ 0 ] ) - .01, Math.max( Math.floor( camPos[ 0 ] ) + .01, pos[ 0 ] ) );
                    elem.style.posZ = Math.min( Math.ceil( camPos[ 2 ] ) - .01, Math.max( Math.floor( camPos[ 2 ] ) + .01, pos[ 2 ] ) );
                  } else { // 降りれる
                    elem.style.posY -= 1;
                  }
                }

                commonData.mainCamPos = elem.style.pos;
              }

            }

            time += delta;
            if ( mode === "main" && time > .05 ) {
              time = 0;
              socket.emit( "move", {
                roomId: commonData.roomId,
                id: localStorage.backDoorId,
                pos: commonData.mainCamPos,
                quat: jyro.style.quat,
                rotateY: elem.childNodes[ 0 ].style.rotateY,
                color: this.baseColor
              });
            }
          }.bind( this ));
        },
        changeBlock: function( coords, isAdd ) {
          isAdd && coords.push( this.baseColor );
          coords[ 0 ] -= .5;
          coords[ 1 ] -= .5;
          coords[ 2 ] -= .5;

          changeBlock({
            roomId: commonData.roomId,
            id: localStorage.backDoorId,
            block: coords
          });

          socket.emit( "changeBlock", {
            roomId: commonData.roomId,
            id: localStorage.backDoorId,
            block: coords
          });

        },
        baseColor: Math.floor( 0xffffff * Math.random() ),
        camHight: { posY: 1.6 },
        roomLength: roomLength,
        doorPos: { pos: [ 0, 1, -ceilingR ] },
        backDoorPos: { pos: [ 0, 1, -ceilingR + 1 ] }, // local pos, mainから戻った際にmainに戻さないようにマージン分引っ込めておく
        wallRotates: Array.apply( null, { length:  roomLength }).map( function(e, idx) {
          return { rotateY: -( idx + .5 ) * Math.PI * 2 / roomLength };
        }),
        wallStyles: [
          { scaleY: 2, pos: [ .75, 1, -ceilingR ] },
          { scaleY: 2, pos: [ -.75, 1, -ceilingR ] },
          { pos: [ .75, 2.5, -ceilingR ] },
          { pos: [ -.75, 2.5, -ceilingR ] },
          { pos: [ .25, 2.5, -ceilingR ] },
          { pos: [ -.25, 2.5, -ceilingR ] }
        ],
        getBackDoorPos: function( elem ) {
          commonData.backDoorPos = elem.style.worldPos;
        },
        blackPanelGeo: {
          type: "PlaneBuffer",
          value: [ 1, 2 ]
        },
        blackPanelMtl: {
          type: "MeshBasic",
          value: {
            color: "#888"
          }
        }
      };
    },
    view: function( ctrl ) {

      return {tag: "scene", attrs: {config: ctrl.setDoorList}, children: [
        {tag: "mesh", attrs: {id:"wallSphere", geo: ctrl.wallSphereGeo, mtl: ctrl.wallSphereMtl, style:{ scaleX: -1}}}, 

        {tag: "obj", attrs: {display: mode === "corridor"}, children: [
           Array.apply(null, {length: ctrl.roomLength }).map( function(e, idx) {return {tag: "obj", attrs: {key: idx, style: ctrl.wallRotates[ idx] }, children: [
            m.component(Door, {class:"door", index: idx, isOpen: commonData.openedDoor === idx, style: ctrl.doorPos}), 
             Array.apply( null, { length:  6 }).map( function(e, i) {return {tag: "mesh", attrs: {geo: ctrl.wallGeo, mtl: ctrl.wallMtl, style: ctrl.wallStyles[ i]}};}) 
          ]};})
        ]}, 

         mode === "main" ? {tag: "obj", attrs: {}, children: [
             userList.map( function( data, idx)  {return m.component(UserFace, {key: idx, data: data });}), 
            m.component(MainWorld, {room: commonData.roomId, vp: commonData.firstVp, addBlock: switchState.block, removeBlock: switchState.remove, dataArray: dataArray, changeBlock: ctrl.changeBlock.bind( ctrl) }), 
            {tag: "obj", attrs: {style: ctrl.wallRotates[ commonData.openedDoor] }, children: [
              {tag: "obj", attrs: {style:{ posZ: .01}}, children: [
                {tag: "mesh", attrs: {geo: ctrl.blackPanelGeo, mtl: ctrl.blackPanelMtl, style: ctrl.backDoorPos}}
              ]}, 
              m.component(Door, {id:"backDoor", class:"door", config: ctrl.getBackDoorPos, index: commonData.openedDoor, isOpen: commonData.openedBackDoor, style: ctrl.backDoorPos})
            ]}
          ]}
        : {tag: "obj", attrs: {}}, 

        {tag: "obj", attrs: {config: ctrl.walk.bind( ctrl), style: ctrl.camHight}, children: [
          {tag: "obj", attrs: {}, children: [
            m.component(JyroSync, {id:"jyro", enabled: !!urlQuery.vr}, [
              {tag: "cam", attrs: {id:"mainCam", near:.001, fov:90}, children: [
                {tag: "light", attrs: {init:{ type: "Dir", color: "#999"}, style:ctrl.lightStyle}}, 
                {tag: "obj", attrs: {id:"gobackMarker", style:{ posZ: -1}}}, 
                {tag: "obj", attrs: {id:"slideMarker", style:{ posX: 1}}}
              ]}
            ])
          ]}
        ]}, 
        {tag: "light", attrs: {init:{ type: "Amb", color: "#999"}}}
      ]};
    }
  });

  function doorHover( elem, isInit ) {
    if ( isInit ) return;

    commonData.firstVp = urlQuery.vr ? elem.childNodes[ 0 ].childNodes[ 0 ] : elem.childNodes[ 0 ];

    var t = 0;
    S.update( function( delta ) {

      t += delta;
      if ( t > .2 ) {
        t = 0;
        var target = elem.pickElementByRatio( isMobile ? .49 : .5, .5 );


        if ( mode === "main") {
          var backDoorState = commonData.openedBackDoor;
          if ( target && target.parentNode.parentNode.className === "door") {
            var targetPos = target.style.worldPos;
            var camPos = S.document.getElementById( "mainCam" ).style.worldPos;
            if ( Math.sqrt( Math.pow( targetPos[ 0 ] - camPos[ 0 ], 2 ) + Math.pow( targetPos[ 2 ] - camPos[ 2 ], 2 ) ) > 3.5 ) {
              commonData.openedBackDoor = false;
            } else if ( Math.sqrt( Math.pow( commonData.backDoorPos[ 0 ] - commonData.mainCamPos[ 0 ], 2 ) + Math.pow( commonData.backDoorPos[ 2 ] - commonData.mainCamPos[ 2 ], 2 ) ) < .8 ) {
              socket.emit( "leave", { roomId: commonData.roomId, id: localStorage.backDoorId });
              commonData.roomId = null;
              mode = "corridor";
              m.redraw();
              window.m.redraw();
              return;
            } else {
              commonData.openedBackDoor = true;
            }
          } else {
            commonData.openedBackDoor = false;
          }

          if ( backDoorState !== commonData.openedBackDoor ) {
            m.redraw();
          }
          return;
        }

        var doorState = commonData.openedDoor;
        if ( !target || target.parentNode.parentNode.className !== "door") {
          commonData.openedDoor = false;
        } else {
          var targetPos = target.style.worldPos;
          var camPos = S.document.getElementById( "mainCam" ).style.worldPos;
          if ( Math.sqrt( Math.pow( targetPos[ 0 ] - camPos[ 0 ], 2 ) + Math.pow( targetPos[ 2 ] - camPos[ 2 ], 2 ) ) > 3.5 ) {
            commonData.openedDoor = false;
          } else {
            commonData.openedDoor = commonData.doorList.indexOf( target.parentNode.parentNode );
          }

        }

        if ( doorState !== commonData.openedDoor ) {
          if ( commonData.openedDoor !== false ) {
            commonData.wallSphereTxr.src = "img/" + commonData.openedDoor + ".jpg";
            commonData.wallSphereTxr.needsUpdate = true;
          }
          m.redraw();
        }
      }
    });
  }

  function render() {
    m.render( S.document.head,
      {tag: "rdr", attrs: {init:{ frame: "#solufa", antialias: true}, config: doorHover, clearColor:"#fff"}, children: [
         urlQuery.vr ? m.component(StereoVp, {cam:"#mainCam"}) : {tag: "vp", attrs: {cam:"#mainCam"}}
      ]}
    );
  }
  render();
});
