var Editor = {
  vm: {
    id: "",
    editor: null,
    init: function( e ) {
      this.id = e.id;
      var editor = this.editor = ace.edit( this.id );
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/javascript");
    }
  },
  view: function( a, data ) {
    var vm = Editor.vm;
    return {tag: "div", attrs: {id: data.id}, children: [
      {tag: "div", attrs: {class:"btns"}, children: [
        {tag: "div", attrs: {class:"back"}}, 
        {tag: "div", attrs: {class:"go"}}, 
        {tag: "div", attrs: {class:"zoom-in"}}, 
        {tag: "div", attrs: {class:"zoom-out"}}, 
        {tag: "div", attrs: {class:"save"}}
      ]}, 
      {tag: "div", attrs: {id: "ace-" + data.id, config:vm.init.bind( vm)}}
    ]};
  }
};
