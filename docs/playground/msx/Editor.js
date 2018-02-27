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
          this.value = editor.getValue();
          this.onchange( this.value );
        }.bind( this ));

      }

      if ( this.editor.getValue() !== this.value ) {
        this.editor.setValue( this.value.replace( /  /g, "\t" ) );
        this.editor.gotoLine( 1, 0 );
      }
    },
    onsave: null,
    onchange: null,
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
    Editor.vm.onchange = data.onchange;
  },
  view: function( a, data ) {
    var vm = Editor.vm;
    vm.value = data.value;

    return <div id={ data.id }>
      <div class="btns">
        <div class="new" title="Create new" onclick={ data.oncreate }/>
        <div class="back" title="Run: Ctrl+Z or ⌘+Z" onclick={ vm.back.bind( vm ) }/>
        <div class="go" title="Run: Ctrl+Y or ⌘+Y" onclick={ vm.go.bind( vm ) }/>
        <div class="save" title="Run: Ctrl+S or ⌘+S" onclick={ vm.save.bind( vm ) }/>
        <div class="zoom-in" title="Zoom in" onclick={ vm.zoomIn.bind( vm ) }/>
        <div class="zoom-out" title="Zoom out" onclick={ vm.zoomOut.bind( vm ) }/>
      </div>
      <div id={ "ace-" + data.id } style={{ fontSize: vm.fontSize + "px"}} config={vm.init.bind( vm)}/>
    </div>;
  }
};
