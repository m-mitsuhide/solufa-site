var Viewer = {
  vm: {
    init: function() {

    }
  },
  controller: function() {
    Viewer.vm.init();
  },
  view: function( a, data ) {
    var vm = Viewer.vm;

    return {tag: "div", attrs: {id: data.id}, children: [
      {tag: "div", attrs: {class: "device" + ( vm.rotation ? " rotation" : "")}, children: [
        {tag: "img", attrs: {class:"phone", src:"../img/iphone.png"}}, 
        {tag: "div", attrs: {class: "viewer" + ( vm.isLandscape ? " landscape" : "")}, children: [
          {tag: "iframe", attrs: {allowfullscreen:true}}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"ctrls rotate", style:{ top: "2.5%", left: "4%"}}}
    ]};
  }
};
