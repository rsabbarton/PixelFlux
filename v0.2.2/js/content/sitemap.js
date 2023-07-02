



var cc = contentful.createClient({
  accessToken: 'x_DzdGB4ZvEQJ9Bu4TBQqQF5o_k3hoN-J6wD9UQngZM',
  space: '9smwd7qs44mw'
})

var order = "-sys.createdAt"




var container = document.getElementById('content')

cc.getEntries({
order: order
})
.then(function(entries) {
container.innerHTML = renderIndex(entries.items)
});


function renderIndex(items){
  var page = ""
  items.forEach((item)=>{
    console.log(item)

    var displayDate = item.sys.createdAt + " - "
    var documentType = item.sys.contentType.sys.id
    
    if(documentType != "comment" && documentType != "object"){

      page += `<div class=indexitem>${displayDate} <a href=/content?type=${documentType}&doc=${item.sys.id}> ${item.fields.title}</a></div>`
    
    }
  })

  return page
}

