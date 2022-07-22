



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

function renderPage(entry){
    console.log(entry)
    var page = ""
      page += `<h3>${entry.fields.title}</h3>`
      page += renderContent(entry.fields.content.content)

  
    return page
  }


  function renderContent(content, lb2br){
      let r = ""
      convertLBtoBR = false;
      if(lb2br)
        convertLBtoBR = true;

      for(var f = 0; f < content.length; f++){
          renderItem(content[f])
      }

      return r

      function renderItem(item){
        switch (item.nodeType) {
            case "paragraph": 
                r+= renderContent(item.content, true)
                break
            case "text":
                if(convertLBtoBR)
                  item.value = item.value.replace(/(?:\r\n|\r|\n)/g, '<br>');
                if(item.marks.length > 0 && item.marks[0].type == 'code'){
                  r+=`<code>${item.value}</code>`
                  break
                }
                r+=`<p>${item.value}</p>`
                break
            case "embedded-asset-block":
                r+=`<img class="embeddedimageasset" src="https://${item.data.target.fields.file.url}" alt="${item.data.target.fields.title}">`;
                break;
            case "hyperlink": r+=`<a href=${item.data.uri}>${renderContent(item.content)}</a>`; break;
            case "heading-1": r+=`<h1>${renderContent(item.content)}</h1>`; break;
            case "heading-2": r+=`<h2>${renderContent(item.content)}</h2>`; break;
            case "heading-3": r+=`<h3>${renderContent(item.content)}</h3>`; break;
            case "heading-4": r+=`<h4>${renderContent(item.content)}</h4>`; break;
            case "heading-5": r+=`<h5>${renderContent(item.content)}</h5>`; break;
            case "heading-6": r+=`<h6>${renderContent(item.content)}</h6>`; break;

        }
      }
  }




function renderComments(docId){
  
  renderCommentForm(docId)

  var contentType = "comment"
  cc.getEntries({
    content_type: contentType,
    'fields.parentObjectId': docId,
    order: "-sys.createdAt"
  })
  .then(function(entries) {
    console.log(entries)
    entries.items.forEach((entry)=>{
      renderComment(entry)

    })
  });
}

function renderComment(entry){
  console.log("rendering a comment:")
  console.log(entry)
  var c = document.createElement("div")
  c.classList.add("sitecontent")
  var commentDate = document.createElement("span")
  commentDate.classList.add("commentdate")
  commentDate.innerHTML = entry.sys.createdAt
  var commentAuthor = document.createElement("span")
  commentAuthor.classList.add("commentauthor")
  commentAuthor.innerHTML = entry.fields.authorDisplayName
  var commentText = document.createElement("div")
  commentText.innerHTML = entry.fields.commentBody
  commentText.classList.add("commentdisplay")

  c.appendChild(commentDate)
  c.appendChild(commentAuthor)
  c.appendChild(commentText)
  document.body.appendChild(c)

}

function renderCommentForm(docId){
  var commentForm = document.createElement("div")
  commentForm.classList.add("sitecontent")
  var commentBody = document.createElement("textarea")
  commentBody.classList.add("commentbody")
  commentBody.id = "commentbody"
  var commentSubmit = document.createElement("button")
  commentSubmit.classList.add("commentsubmit")
  commentSubmit.id = "commentsubmit"
  commentSubmit.innerText = "Add Comment"
  commentSubmit.onclick = (event)=>{
    submitCommentForm(docId, commentBody.value)
  }
  commentForm.appendChild(commentBody)
  commentForm.appendChild(commentSubmit)
  document.body.append(commentForm)
}

function submitCommentForm(docId, text){
  console.log(docId)
  console.log(text)
  var displayName = siteUser.displayName
  var email = siteUser.email
  var formData = {
    displayName: displayName,
    email: email,
    docId: docId,
    text: text
  }
  post("/comment", formData)
  .then(()=>{
   location.reload()
  })
}