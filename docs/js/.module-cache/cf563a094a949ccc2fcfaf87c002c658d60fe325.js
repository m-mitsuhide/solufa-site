var Viewer = {
  vm: {
    isFull: false,
    rotation: false,
    isLandscape: false,
    init: function() {

    },
    rotate: function() {
      this.rotation = !this.rotation;
      setTimeout( this.landscape.bind( this ), 300 );
    },
    landscape: function() {
      this.isLandscape = this.rotation;
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
          {tag: "div", attrs: {class:"ctrls cs", style:{ display: vm.isFull ? "block" : "none", bottom: "5px", right: "5px"}}}
        ]}
      ]}, 
      {tag: "div", attrs: {class:"ctrls rotate", style:{ bottom: "2.5%", left: "4%"}, onclick: vm.rotate.bind( vm)}}, 
      {tag: "div", attrs: {class:"ctrls share", style:{ top: "2.5%", left: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls close", style:{ top: "2.5%", right: "4%"}}}, 
      {tag: "div", attrs: {class:"ctrls fs", style:{ bottom: "2.5%", right: "4%"}}}
    ]};
  }
};
