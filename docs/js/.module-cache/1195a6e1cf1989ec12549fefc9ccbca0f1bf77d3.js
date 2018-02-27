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
    return {tag: "div", attrs: {id: data.id, config:vm.init.bind( vm)}
    };
  }
};
