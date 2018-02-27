var DropArea = {
  controller: function( attrs ) {
    return {
      isDrag: false,
      onDragEnter: function() {
        this.isDrag = true;
      },
      onDragLeave: function() {
        this.isDrag = false;
      },
      onDragOver: function( e ) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      },
      onDrop: function( e ) {
        e.stopPropagation();
        e.preventDefault();
        this.isDrag = false;

        attrs.ondrop( e.dataTransfer.files );
      },
      onChange: function( e ) {
        attrs.ondrop( e.target.files );
        e.target.value = null;
      }
    };
  },
  view: function( ctrl, attr ) {
    return {tag: "form", attrs: {className: ctrl.isDrag ? "dropper on" : "dropper", method:"post", encType:"multipart/form-data"}, children: [
      {tag: "span", attrs: {}, children: ["Drop .js files"]}, 
      {tag: "input", attrs: {type:"file", className:"form-control", multiple:true,
        ondragenter: ctrl.onDragEnter.bind( ctrl), 
        ondragleave: ctrl.onDragLeave.bind( ctrl), 
        ondragOver: ctrl.onDragOver.bind( ctrl), 
        ondrop: ctrl.onDrop.bind( ctrl), 
        onchange: ctrl.onChange.bind( ctrl) }
      }
    ]};
  }
};
