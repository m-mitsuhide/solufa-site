!function() {

var floorLinePos = [];
for ( var x = -50; x < 51; x++ ) {
  floorLinePos.push( x, 0, x % 2 ? 50 : -50 );
  floorLinePos.push( x, 0, x % 2 ? -50 : 50 );
}
for ( var z = 50; z > -51; z-- ) {
  floorLinePos.push( z % 2 ? 50 : -50, 0, z );
  floorLinePos.push( z % 2 ? -50 : 50, 0, z );
}

var n = .49;
var boxLinePos = [
  -n, n, n,
  n, n, n,
  n, -n, n,
  -n, -n, n,
  -n, n, n,
  -n, n, -n,
  n, n, -n,
  n, -n, -n,
  -n, -n, -n,
  -n, n, -n,
  -n, -n, -n,
  -n, -n, n,
  n, -n, n,
  n, -n, -n,
  n, n, -n,
  n, n, n
];


window.MainWorld = {
  controller: function( attr ) {
    return {
      lineFloorGeo: {
        type: "Buffer",
        attrs: {
          position: floorLinePos
        }
      },
      lineFloorMtl: {
        type: "LineBasic",
        value: {
          color: "#0f0"
        }
      },
      floorGeo: {
        type: "PlaneBuffer",
        value: [ 100, 100 ]
      },
      floorMtl: {
        type: "MeshBasic",
        value: {}
      },
      floorStyle: {
        rotateX: -Math.PI / 2,
        opacity: 0
      },
      floorHitPoint: null,
      defaultHitPoint: [ 0, .5, 0 ],
      floorHit: function( elem, isInit, context ) {
        if ( isInit ) return;

        var t = 0;

        function hide( elem ) {
          elem.setAttribute( "display", false );
        }

        function show( elem ) {
          elem.setAttribute( "display", true );
        }

        context.update = function( delta ) {

          t += delta;
          if ( t < .2 ) return;
          t = 0;

          // インスタンスがたまに再生成される？のでキャッシュできない
          var clearBlock = S.document.getElementById( "MainWorld_clear" );
          var lineFloor = S.document.getElementById( "MainWorld_lineFloor" );
          var dammy = S.document.getElementById( "MainWorld_dammy" );
          var lineBox = dammy.querySelectorAll( ".MainWorld_lineBox" ).slice( -6 ); //v0.3.1のバグで古いインスタンスが残り続ける
          var dammyBox = dammy.querySelectorAll( ".MainWorld_dammyBox" ).slice(-6 );


          var clearBlockState = clearBlock.getAttribute( "display" );

          if ( clearBlockState ) hide( clearBlock );
          hide( lineFloor );
          lineBox.forEach( hide );
          // 当たり判定から外す

          dammyBox.forEach( show );

          var target = attr.vp.pickElementByRatio( .5, .5 );

          if ( clearBlockState ) show( clearBlock );
          show( lineFloor );
          lineBox.forEach( show );

          dammyBox.forEach( hide );

          if ( target.className === "MainWorld_block" ) {
            var index = target.getAttribute( "index" );

            if ( this.blockHitInfo && index === this.blockHitInfo.index ) return;

            this.floorHitPoint = null;
            this.dammyHitInfo = null;
            this.blockHitInfo = {
              index: index,
              pos: target.style.pos
            };

            S.m.redraw();

          } else if ( target.className === "MainWorld_dammyBox" ) {

            var index = target.getAttribute( "index" );

            if ( this.dammyHitInfo && index === this.dammyHitInfo.index ) return;

            this.dammyHitInfo = {
              index: index,
              pos: target.style.worldPos
            };

            S.m.redraw();

          } else if ( target.id === "MainWorld_floor" ) {
            this.blockHitInfo = null;
            this.dammyHitInfo = null;

            var point = attr.vp.pickPointByRatio( .5, .5, elem );

            var tmpX = Math.floor( point.point.x );
            var tmpZ = Math.floor( point.point.z );

            if ( this.floorHitPoint && this.floorHitPoint[ 0 ] === tmpX + .5 && this.floorHitPoint[ 2 ] === tmpZ + .5 ) return;

            this.floorHitPoint = [ tmpX + .5, .5, tmpZ + .5 ];
            S.m.redraw();
          } else if ( this.floorHitPoint || this.blockHitInfo || this.dammyHitInfo ) {
            this.floorHitPoint = null;
            this.blockHitInfo = null;
            this.dammyHitInfo = null;
            S.m.redraw();
          }

        }.bind( this );

        S.update( context.update );
        context.onunload = function() {
          S.update( this.update, false );
        };

      },
      blackBlockGeo: {
        type: "BoxBuffer",
        value: [ 1, 1, 1 ]
      },
      blackBlockMtl: {
        type: "MeshBasic",
        value: {
          color: "#fff"
        }
      },
      clearBlockGeo: {
        type: "BoxBuffer",
        value: [ 1, 1, 1 ]
      },
      clearBlockMtl: {
        type: "MeshBasic",
        value: {
          color: "#6f6"
        }
      },
      blockGeo: {
        type: "BoxBuffer",
        value: [ 1, 1, 1 ]
      },
      blockPosList: attr.blockPosList,
      getBlockMtl: function() {
        var blockMtlStore = {};
        return function( color ) {
          blockMtlStore[ color ] = blockMtlStore[ color ] || {
            type: "MeshLambert",
            value: {
              color: color
            }
          };
          return blockMtlStore[ color ];
        };
      }(),
      addBlock: function( pos ) {
        var p = [ pos[ 0 ], pos[ 1 ], pos[ 2 ] ];
        attr.changeBlock( p, true );
      },
      removeBlock: function( pos ) {
        var p = [ pos[ 0 ], pos[ 1 ], pos[ 2 ] ];
        attr.changeBlock( p, false );
      },
      blockHitInfo: null, // { index, pos }
      dammyStyles: [
        { posY: -1 },
        { posY: 1 },
        { posX: 1 },
        { posX: -1 },
        { posZ: 1 },
        { posZ: -1 },
      ],
      dammyGeo: {
        type: "BoxBuffer",
        value: [ .998, .998, .998 ]
      },
      dammyMtl: {
        type: "MeshBasic",
        value: {}
      },
      dammyHitInfo: null, // { index, pos }
      lineBoxGeo: {
        type: "Buffer",
        attrs: {
          position: boxLinePos
        }
      },
      lineBoxMtl: {
        type: "LineBasic",
        value: {
          color: "#fff"
        }
      }
    };
  },
  view: function( ctrl, attr ) {

    if ( attr.addBlock() ) {
      attr.addBlock( false );
      if ( ctrl.dammyHitInfo ) {
        ctrl.addBlock( ctrl.dammyHitInfo.pos );

      } else if ( ctrl.floorHitPoint ) {
        ctrl.addBlock( ctrl.floorHitPoint );
      }
    }

    if ( attr.removeBlock() ) {
      attr.removeBlock( false );
      if ( ctrl.blockHitInfo ) {
        ctrl.removeBlock( ctrl.blockHitInfo.pos );

        ctrl.floorHitPoint = null;
        ctrl.blockHitInfo = null;
        ctrl.dammyHitInfo = null;
      }
    }

    var dammyPos = ctrl.blockHitInfo ? ctrl.blockHitInfo.pos : ctrl.defaultHitPoint;

    return {tag: "obj", attrs: {}, children: [
      {tag: "obj", attrs: {id:"MainWorld_dammy", display: !!ctrl.blockHitInfo, style:{ pos: dammyPos}}, children: [
         ctrl.dammyStyles.map( function( style, idx)   {return {tag: "obj", attrs: {key: idx, display: idx || dammyPos[ 1 ] > 1, style: style }, children: [
          {tag: "mesh", attrs: {class:"MainWorld_dammyBox", index: idx, geo: ctrl.dammyGeo, mtl: ctrl.dammyMtl}}, 
          {tag: "line", attrs: {class:"MainWorld_lineBox", geo: ctrl.lineBoxGeo, mtl: ctrl.lineBoxMtl}}
        ]};})
      ]}, 
       attr.dataArray.map( function( data, idx)  {return {tag: "mesh", attrs: {key: idx, index: idx, class:"MainWorld_block", geo: ctrl.blockGeo, mtl: ctrl.getBlockMtl( data[ 3 ]), style:{ pos: data}}};}), 
      {tag: "mesh", attrs: {id:"MainWorld_black", geo: ctrl.blackBlockGeo, mtl: ctrl.blackBlockMtl, display: !!ctrl.blockHitInfo, style:{ opacity: .8, pos: ( ctrl.blockHitInfo && ctrl.blockHitInfo.pos ) || ctrl.defaultHitPoint}}}, 
      {tag: "mesh", attrs: {id:"MainWorld_clear", geo: ctrl.clearBlockGeo, mtl: ctrl.clearBlockMtl, display: !!ctrl.floorHitPoint || !!ctrl.dammyHitInfo, style:{ opacity: .8, pos: ( ctrl.dammyHitInfo && ctrl.dammyHitInfo.pos ) || ctrl.floorHitPoint || ctrl.defaultHitPoint}}}, 
      {tag: "mesh", attrs: {id:"MainWorld_floor", config: ctrl.floorHit.bind( ctrl), geo: ctrl.floorGeo, mtl: ctrl.floorMtl, style: ctrl.floorStyle}}, 
      {tag: "line", attrs: {id:"MainWorld_lineFloor", geo: ctrl.lineFloorGeo, mtl: ctrl.lineFloorMtl}}
    ]};
  }
};

}();
