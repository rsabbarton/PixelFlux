



var cc = contentful.createClient({
  accessToken: 'x_DzdGB4ZvEQJ9Bu4TBQqQF5o_k3hoN-J6wD9UQngZM',
  space: '9smwd7qs44mw'
})


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const search = urlParams.get("search") ? urlParams.get("search") : false
const spriteId = urlParams.get("sprite") ? urlParams.get("sprite") : false
let indexDisplay = false


if(!spriteId)
    indexDisplay = true

var order = "-sys.createdAt"
  

var container = document.getElementById('content')
  
if(indexDisplay){
    cc.getEntries({
    content_type: 'object',
    order: order
    })
    .then(function(entries) {
    renderIndex(entries.items)
    });
} else {
    cc.getEntry(spriteId).then(function (entry) {
      // logs the entry metadata
      console.log(entry.sys)
      renderPage(entry)
      renderComments(entry.sys.id)
    });
}
  
function renderIndex(items){
  items.forEach((item)=>{
    //console.log(item)
    if(item.fields.type == "sprite"){
      renderSpritePreview(item)
    }

    if(item.fields.type == "pallet"){
      renderPalletPreview(item)
    }
  })
}
  


function renderSpritePreview(item){
  var id = item.sys.id
  var size = 128
  var date = item.sys.createdAt
  var name = item.fields.name
  var owner = item.fields.ownerDisplayName
  var s = new Sprite()
  s.loadFromSprite(item.fields.objectData.spriteData)
  var canvas = document.createElement("canvas")
  canvas.classList.add("gallerypreviewcanvas")
  canvas.width = size
  canvas.height = size
  canvas.id = "canvas" + id
  var ctx = canvas.getContext("2d")

  var nameDisplay = document.createElement("div")
  nameDisplay.classList.add("gallerynamedisplay")
  nameDisplay.innerHTML = name

  var dateDisplay = document.createElement("div")
  dateDisplay.classList.add("gallerydatedisplay")
  dateDisplay.innerHTML = date

  var preview = document.createElement("div")
  preview.classList.add("gallerypreview")

  preview.appendChild(canvas)
  preview.appendChild(dateDisplay)
  preview.appendChild(nameDisplay)
  
  container.appendChild(preview)

  s.updateCanvasChain()

  setInterval(function (){
    s.drawAnimationToCanvasId(canvas.id, 0, 0, size/s.width)
  }, 1000/s.fps)
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
