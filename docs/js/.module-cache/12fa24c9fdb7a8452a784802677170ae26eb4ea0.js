var Editor = {
  vm: {
    id: "",
    editor: null,
    fontSize: 16,
    value: "",
    init: function( e ) {
      if ( !this.editor ) {

        this.id = e.id;
        var editor = this.editor = ace.edit( this.id );
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/jsx");
        editor.commands.addCommand({
          name: 'save',
          bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
          exec: this.save.bind( this )
        });
        editor.commands.addCommand({
          name: 'zoomIn',
          bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
          exec: this.save.bind( this )
        });

        editor.on( "change", function( e, editor ) {
          this.value = editor.getValue();console.log(this.value)
        }.bind( this ));

      }

      if ( this.editor.getValue() !== this.value ) this.editor.setValue( this.value );
    },
    onsave: null,
    save: function() {
      this.onsave( this.value );
    },
    zoomIn: function() {
      this.fontSize += 2;
    },
    zoomOut: function() {
      this.fontSize -= 2;
    },
    back: function() {
      this.editor.undo();
    },
    go: function() {
      this.editor.redo();
    }
  },
  controller: function( data ) {
    Editor.vm.onsave = data.onsave;
  },
  view: function( a, data ) {
    var vm = Editor.vm;
    vm.value = data.value;

    return {tag: "div", attrs: {id: data.id}, children: [
      {tag: "div", attrs: {class:"btns"}, children: [
        {tag: "div", attrs: {class:"back", title:"Run: Ctrl+Z or ⌘+Z", onclick: vm.back.bind( vm) }}, 
        {tag: "div", attrs: {class:"go", title:"Run: Ctrl+Y or ⌘+Y", onclick: vm.go.bind( vm) }}, 
        {tag: "div", attrs: {class:"save", title:"Run: Ctrl+S or ⌘+S", onclick: vm.save.bind( vm) }}, 
        {tag: "div", attrs: {class:"zoom-in", onclick: vm.zoomIn.bind( vm) }}, 
        {tag: "div", attrs: {class:"zoom-out", onclick: vm.zoomOut.bind( vm) }}
      ]}, 
      {tag: "div", attrs: {id: "ace-" + data.id, style:{ fontSize: vm.fontSize + "px"}, config:vm.init.bind( vm)}}
    ]};
  }
};
