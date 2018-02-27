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
          {tag: "iframe", attrs: {allowfullscreen:true}}, 
          {tag: "div", attrs: {class:"ctrls fs", style:{ bottom: "5px", right: "5px"}}}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"ctrls rotate", style:{ bottom: "2.5%", left: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls share", style:{ top: "2.5%", left: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls close", style:{ top: "2.5%", right: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls fs", style:{ bottom: "2.5%", right: "4%"}}}
    ]};
  }
};
