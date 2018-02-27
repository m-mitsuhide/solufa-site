var Menu = {
  view: function( a, data ) {
    var list = data.list;
    return {tag: "div", attrs: {}, children: [
    list.map( function(li)  {return {tag: "div", attrs: {}, children: [
      {tag: "span", attrs: {class:"title"}, children: [li.title]}, 
      {tag: "div", attrs: {}, children: [
      li.child.map( function(child)  {return {tag: "div", attrs: {}, children: [ child.title]};})
      ]}
    ]};})
    ]};
  }
};
