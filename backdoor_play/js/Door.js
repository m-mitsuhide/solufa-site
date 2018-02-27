var Door = {
  common: {
    geo: {
      type: "PlaneBuffer",
      value: [ 1, 2 ]
    },
    frameMtl: {
      type: "MeshBasic",
      value: {
        transparent: true,
        opacity: 0
      }
    },
    frameStyle: {
      posZ: -.001
    },
    inFrameMtl: {
      type: "MeshBasic",
      value: {
        color: "#fff",
        side: 1
      }
    },
    inFrameStyle: {
      posZ: .005
    },
    doorMtl: {
      type: "MeshBasic",
      value: {
        map: {
          type: "image",
          src: "img/door.jpg"
        },
        side: 2
      }
    },
    doorObjStyle: {
      posX: .5
    },
    doorStyle: {
      posX: -.5
    },
    plateGeo: {
      type: "PlaneBuffer",
      value: [ .2, .4 ]
    },
    plateMtls: Array.apply( null, { length: 20 } ).map( function( e, idx ) {
      return {
        type: "MeshLambert",
        value: {
          map: {
            type: "image",
            src: "number/" + idx + ".png"
          }
        }
      };
    }),
    rightPlateStyle: {
      pos: [ -.4, .5, .001 ]
    },
    leftPlateStyle: {
      pos: [ -.6, .5, .001 ]
    }
  },
  controller: function() {
    return {
      doorMotion: function() {
        var opened = false;
        var obj;
        var t = 0;
        function move( delta ) {
          t += delta;
          obj.style.rotateY = opened ? - t / .5 * Math.PI / 2 : ( 1 - t ) * -Math.PI / 2;
          if ( t > .5 ) {
            obj.style.rotateY = opened ? -Math.PI / 2 : 0;
            S.update( move, false );
            t = 0;
          }
        }

        return function( isOpen, elem ) {
          if ( opened === isOpen ) return;
          opened = isOpen;
          obj = elem;
          S.update( move, false );
          S.update( move );
        };
      }()
    };
  },
  view: function( ctrl, attr ) {
    var common = Door.common;

    return {tag: "obj", attrs: {class: attr.class, config: attr.config, key: attr.key, style: attr.style, display: attr.display}, children: [
      {tag: "obj", attrs: {style: common.doorObjStyle, config: ctrl.doorMotion.bind( null, attr.isOpen)}, children: [
        {tag: "mesh", attrs: {geo: common.geo, mtl: common.doorMtl, style: common.doorStyle}}, 
        {tag: "mesh", attrs: {geo: common.plateGeo, mtl: common.plateMtls[ ( attr.index + 1 ) % 10], style: common.rightPlateStyle}}, 
        {tag: "mesh", attrs: {geo: common.plateGeo, mtl: common.plateMtls[ Math.floor( ( attr.index + 1 ) / 10 )], style: common.leftPlateStyle}}
      ]}, 
      {tag: "obj", attrs: {}, children: [
        {tag: "mesh", attrs: {geo: common.geo, mtl: common.frameMtl, style: common.frameStyle}}
      ]}, 
      {tag: "obj", attrs: {}, children: [
        {tag: "mesh", attrs: {geo: common.geo, mtl: common.inFrameMtl, style: common.inFrameStyle}}
      ]}
    ]};
  }
};
