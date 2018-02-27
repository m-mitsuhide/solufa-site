var Menu = {
  view: function( a, data ) {
    var list = data.list;
    return {tag: "div", attrs: {}, children: [
    list.map( li => {tag: "div", attrs: {}, children: [li.title]})
    ]};
  }
};
