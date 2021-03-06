var Editor = {
  vm: {
    id: "",
    editor: null,
    js: { code: "" },
    init: function( e ) {
      if ( this.editor ) return;
      this.id = e.id;
      var editor = this.editor = ace.edit( this.id );
      editor.setTheme("ace/theme/chrome");
      editor.getSession().setMode("ace/mode/jsx");
      editor.commands.addCommand({
        name: 'save',
        bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
        exec: this.save.bind( this )
      });
    },
    onsave: null,
    save: function( editor ) {
      this.onsave( editor.getValue() );
    }
  },
  controller: function( data ) {
    Editor.vm.onsave = data.onsave;
  },
  view: function( a, data ) {
    var vm = Editor.vm;
    return {tag: "div", attrs: {id: data.id}, children: [
      {tag: "div", attrs: {class:"btns"}, children: [
        {tag: "div", attrs: {class:"back"}}, 
        {tag: "div", attrs: {class:"go"}}, 
        {tag: "div", attrs: {class:"save", title:"Run: Ctrl+S or ⌘+S", onclick: vm.save.bind( vm) }}, 
        {tag: "div", attrs: {class:"zoom-in"}}, 
        {tag: "div", attrs: {class:"zoom-out"}}
      ]}, 
      {tag: "div", attrs: {id: "ace-" + data.id, style:{ fontSize: 16 + "px"}, config:vm.init.bind( vm)}}
    ]};
  }
};
