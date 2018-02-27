var Viewer = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    Viewer.vm.init();
  },
  view: function( a, data ) {
    var vm = Viewer.vm;console.log(data.needsUpdate)

    return {tag: "div", attrs: {id: data.id}, children: [

      {tag: "div", attrs: {class: "device" + ( vm.rotation ? " rotation" : "")}, children: [
        {tag: "img", attrs: {class:"phone", src:"../img/iphone.png"}}, 
        {tag: "div", attrs: {id:"jthree", class: "viewer" + ( vm.isLandscape ? " landscape" : "")}}
      ]}
    ]};
  }
};
