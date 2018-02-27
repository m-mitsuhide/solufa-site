var UserFace = {
  controller: function( attr ) {
    return {
      faceGeo: {
        type: "BoxBuffer",
        value: [ .45, .25, .4 ]
      },
      faceMtl: {
        type: "MeshLambert",
        value: {
          color: "#864815"
        }
      },
      headGeo: {
        type: "SphereBuffer",
        value: [ .32, 32, 32 ]
      },
      whiteEyeGeo: {
        type: "CircleBuffer",
        value: [ .08, 32 ]
      },
      whiteEyeMtl: {
        type: "MeshBasic",
        value: {
          color: "#fff",
          side: 1
        }
      },
      blackEyeGeo: {
        type: "CircleBuffer",
        value: [ .06, 32 ]
      },
      blackEyeMtl: {
        type: "MeshBasic",
        value: {
          color: "#000",
          side: 1
        }
      },
      blink: function( elem, isInit, context ) {
        if ( isInit ) return;

        function closeEye() {
          elem.style.scaleY = .1;
          setTimeout( function() {
            elem.style.scaleY = 1;
          }, 200 );
        }

        function loop() {
          closeEye();
          context.update = setTimeout( loop, Math.random() * 10000 );
        }

        context.onunload = function() {
          clearTimeout( context.update );
        };

        loop();

      },
      getHeadMtl: function() {
        var headMtlStore = {};
        return function( color ) {
          headMtlStore[ color ] = headMtlStore[ color ] || {
            type: "MeshLambert",
            value: {
              color: color
            }
          };
          return headMtlStore[ color ];
        };
      }(),
    };
  },
  view: function( ctrl, attr ) {
    return {tag: "obj", attrs: {key: attr.key, style:{ pos: attr.data.pos}}, children: [
      {tag: "obj", attrs: {style:{ rotateY: attr.data.rotateY}}, children: [
        {tag: "obj", attrs: {style:{ quat: attr.data.quat}}, children: [
          {tag: "mesh", attrs: {geo: ctrl.faceGeo, mtl: ctrl.faceMtl, style:{ posZ: -.25}}, children: [
            {tag: "mesh", attrs: {geo: ctrl.headGeo, mtl: ctrl.getHeadMtl( attr.data.color), style:{ pos: [ 0, -.06, .15 ]}}}, 

            {tag: "mesh", attrs: {geo: ctrl.whiteEyeGeo, mtl: ctrl.whiteEyeMtl, style:{ pos: [ .1, 0, -.21 ]}}}, 
            {tag: "mesh", attrs: {geo: ctrl.whiteEyeGeo, mtl: ctrl.whiteEyeMtl, style:{ pos: [ -.1, 0, -.21 ]}}}, 

            {tag: "obj", attrs: {config: ctrl.blink}, children: [
              {tag: "mesh", attrs: {geo: ctrl.blackEyeGeo, mtl: ctrl.blackEyeMtl, style:{ pos: [ .1, 0, -.225 ]}}}, 
              {tag: "mesh", attrs: {geo: ctrl.blackEyeGeo, mtl: ctrl.blackEyeMtl, style:{ pos: [ -.1, 0, -.225 ]}}}
            ]}
          ]}
        ]}
      ]}
    ]};
  }
};
