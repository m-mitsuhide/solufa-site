var Menu = {
  view: function( a, data ) {
    var list = data.list;console.log(list)
    return {tag: "div", attrs: {id:"menu"}, children: [
    list.map( function(li)  {return {tag: "div", attrs: {}, children: [
      {tag: "span", attrs: {class:"title"}, children: [li.title]}, 
      {tag: "div", attrs: {class:"list"}, children: [
      li.child.map( function(child)  {return {tag: "div", attrs: {value:li.category + ":" + child.path}, children: [ child.title]};})
      ]}
    ]};})
    ]};
  }
};
