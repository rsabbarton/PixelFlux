require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const path = require('path')
const url = require("url")
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const crypto = require("crypto")

const contentful = require('contentful-management')
const client = contentful.createClient({
  accessToken: process.env.CONTENTFULKEY
})

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: 'n1smtpout.europe.secureserver.net',
  port: 25,
  secure: false
});

const dataPath = "./data"
const spritePath = "./data/sprites"
const metaPath = "./data/meta"

var stashdoc = require('./modules/stashdoc.js')
var sd = new stashdoc.stashdoc(dataPath)


app.use(express.static('public'))
app.use(bodyParser.json({ limit: '10mb' })) // To parse the incoming requests with JSON payloads
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send(loadHTMLPage('home.html'))
})

app.get('/app', (req, res) => {
  res.send(loadHTMLPage('app.html'))
})

app.get('/app-dev', (req, res) => {
  res.send(loadDevHTMLPage('app-dev.html'))
})


app.get('/content', (req, res) => {
  res.send(loadHTMLPage('content.html'))
}) 


app.get('/gallery', (req, res) => {
  res.send(loadHTMLPage('gallery.html'))
}) 

app.get('/sitemap', (req, res) => {
  res.send(loadHTMLPage('sitemap.html'))
}) 


app.get('/sitemap.xml', (req, res) => {
  createSitemap(req, res)
}) 
















app.listen(port, () => {
  console.log(`PixelFlux Listening on Port: ${port}`)
})


app.post('/comment', (req, res)=>{

  var token = "Auth Token Not provided"
  if(req.cookies.authtoken){
    token = req.cookies.authtoken
  }
  
  var u = new user(dataPath)
  var loggedIn = u.validate(token)

  if(!loggedIn){
    var errorResponse = {
      errorCode: 403,
      errorMessage: "Not Logged In or Auth Token invalid"
    }
    res.send(JSON.stringify(errorResponse))
    console.log(errorResponse)
    return
  } else {
    var saveData = {
      displayName: req.body.displayName,
      parentObjectId: req.body.docId,
      authorDisplayName: req.body.displayName,
      authorEmail: req.body.email,
      commentBody: req.body.text
    }

    client.getSpace(process.env.CONTENTFULSPACE)
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.createEntry('comment', {
    fields: {
      authorDisplayName: {
        'en-US': saveData.displayName
      },
      parentObjectId: {
          'en-US': saveData.parentObjectId
      },
      commentBody: {
        'en-US': saveData.commentBody
      },
      authorEmail: {
        'en-US': saveData.authorEmail
      }
    }
    }))
    .then((entry) => {
      console.log(entry)
      entry.publish()
    })
    .catch(console.error)


  }
  res.send("OK")
})

app.get('/spritelist', (req, res)=>{
  const queryObject = url.parse(req.url,true).query
  var owned = queryObject.owned ? true : false
  var shared = queryObject.shared ? true : false
  var limit = queryObject.limit ? queryObject.limit : false
  var index = queryObject.index ? queryObject.index : 0
  
  var token = req.cookies.authtoken ? req.cookies.authtoken : "NotSet"

  
  var u = new user(dataPath)
  var loggedIn = u.validate(token)
  var userId = u.store.id ? u.store.id : false

  console.log("USER ID for SpriteList Load: " + userId)

  var e400 = {
    errorCode: 400,
    errorMessage: "Sprite ID Not provided in URL Params"
  }

  var e404 = {
    errorCode: 404,
    errorMessage: "Sprite ID Not found"
  }
  
  var metaFiles = fs.readdirSync(metaPath)
  var indexNumber = 0
  var spriteList = new Array()
  
  metaFiles.forEach((file)=>{
    if(!(limit && spriteList.length >= limit)){
      if(indexNumber >= index){
      var meta = sd.loadFrom("meta", file)
        if(meta){
          var add = false
          console.log("sprite owner meta: " + meta.owner)
          if(owned && meta.owner == userId) add = true
          if(shared && meta.shared) add = true
            
          if(add) spriteList.push(meta)

        }
      }
      indexNumber++
    }
  })


  
  if(spriteList.length == 0){
    res.send(JSON.stringify(e404))
    return
  } else {
    res.send(JSON.stringify(spriteList))
  }


})

app.get('/load', (req, res)=>{
  const queryObject = url.parse(req.url,true).query
  var id = queryObject.id ? queryObject.id : false
  if(!id){
    var e = {
      errorCode: 400,
      errorMessage: "Sprite ID Not provided in URL Params"
    }
    res.send(JSON.stringify(e))
    return
  }

  var spriteData = sd.loadFrom("sprites", id + "_sprite.json")

  if(!spriteData){
    var e = {
      errorCode: 404,
      errorMessage: "Sprite ID Not found"
    }
    res.send(JSON.stringify(e))
    return
  } else {
    res.send(SDON.stringify(spriteData))
  }


})



app.post('/save', (req, res)=>{

  var token = "Auth Token Not provided"
  if(req.cookies.authtoken){
    token = req.cookies.authtoken
  }
  
  var id = crypto.randomUUID()

  var u = new user(dataPath)
  var loggedIn = u.validate(token)

  if(!loggedIn){
    var errorResponse = {
      errorCode: 403,
      errorMessage: "Not Logged In or Auth Token invalid"
    }
    res.send(JSON.stringify(errorResponse))
    console.log(errorResponse)
    return

  } else {

    var metaData = {
      id: id,
      name: req.body.name,
      description: "",
      owner: u.store.id,
      ownerDisplayName: u.store.displayName,
      shared: true,
      deleted: false
    }

    var saveData = {
      id: id,
      name: req.body.name,
      description: "",
      owner: u.store.id,
      ownerDisplayName: u.store.displayName,
      shared: true,
      deleted: false,
      spriteData: req.body
    }

    var metaString = JSON.stringify(metaData);
    var dataString = JSON.stringify(saveData);
    
    fs.writeFileSync(path.join(metaPath, id), metaString)
    fs.writeFileSync(path.join(spritePath, id), dataString)

    res.send("OK")
    return

    // legacy code below is not executed.
    client.getSpace(process.env.CONTENTFULSPACE)
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.createEntry('object', {
    fields: {
      name: {
        'en-US': saveData.name
      },
      type: {
          'en-US': "sprite"
      },
      owner: {
        'en-US': saveData.owner
      },
      ownerDispayName: {
        'en-US': saveData.ownerDisplayName
      },
      objectData: {
        'en-US': saveData.spriteData
      }
    }
    }))
    .then((entry) => entry.publish())
    .catch(console.error)


  }
  res.send("OK")
})

app.get('/get-my-sprites', (req, res)=>{
  var token = "Auth Token Not provided"
  if(req.cookies.authtoken){
    token = req.cookies.authtoken
  }
  
  var u = new user(dataPath)
  var loggedIn = u.validate(token)

  var response = new Array()
 
  console.log(u.store.email)
  client.getSpace(process.env.CONTENTFULSPACE).then((space) => {
    space.getEnvironment('master').then((environment) => {
      environment.getEntries({
        'fields.owner': `${u.store.email}`,
        content_type: 'object',
      })
      .then(function (entries) {
        entries.items.forEach(function (entry) {
          console.log(entry)
          response.push(entry)
        })
      })
      .then(()=>{
        res.send(JSON.stringify(response))
      })
    })
  })
  
  
})

app.get('/loadsprite', (req, res)=>{
  var token = "Auth Token Not provided"
  if(req.cookies.authtoken){
    token = req.cookies.authtoken
  } else {
    var e = {
      errorCode: 403,
      errorMessage: "Not Logged In"
    }
    res.send(JSON.stringify(e))
    return
  }
  
  const queryObject = url.parse(req.url,true).query
  console.log(queryObject.spritename)
  var spriteName = queryObject.spritename

  var u = new user(dataPath)
  var loggedIn = u.validate(token)

  var response = {
    errorCode: 404,
    errorMessage: "Sprite Not Found!"
  }
 
  var contentQuery = {
    'fields.owner': `${u.store.email}`,
    content_type: 'object',
    'fields.name': `${spriteName}`
  }

  console.log(u.store.email)
  client.getSpace(process.env.CONTENTFULSPACE).then((space) => {
    space.getEnvironment('master').then((environment) => {
      environment.getEntries(contentQuery)
      .then(function (entries) {
        entries.items.forEach(function (entry) {
          //console.log(entry)
          response = entry
          console.log(response)
        })
      })
      .then(()=>{
        res.send(JSON.stringify(response))
      })
    })
  })
  
  
})

function loadHTMLPage(page){
  
  var html = ""
  var headerJS = ""
  
  var files = fs.readdirSync("./public/js/common")
  files.forEach((f)=>{
    if(path.extname(f.toString()).toLowerCase() == '.js'){
      headerJS += "<script src='/js/common/" + path.basename(f) + "'></script>"
    }
    
  })
    

  var cssfiles = fs.readdirSync("./public/css")
  cssfiles.forEach((f)=>{
    if(path.extname(f.toString()).toLowerCase() == '.css'){
      headerJS += "<link rel='stylesheet' href='/css/" + path.basename(f) + "'>"
    }
    
  })
    

  
  html = fs.readFileSync('./pages/' + page).toString()
  html = html.replace("</head>", headerJS + "</head>")
  
  
  
  return html
}


function loadDevHTMLPage(page){
  
  var html = ""
  var headerJS = ""
  
  var files = fs.readdirSync("./public/dev/js/common")
  files.forEach((f)=>{
    if(path.extname(f.toString()).toLowerCase() == '.js'){
      headerJS += "<script src='/dev/js/common/" + path.basename(f) + "'></script>"
    }
    
  })
    

  var cssfiles = fs.readdirSync("./public/dev/css")
  cssfiles.forEach((f)=>{
    if(path.extname(f.toString()).toLowerCase() == '.css'){
      headerJS += "<link rel='stylesheet' href='/dev/css/" + path.basename(f) + "'>"
    }
    
  })
    

  
  html = fs.readFileSync('./pages/' + page).toString()
  html = html.replace("</head>", headerJS + "</head>")
  
  
  
  return html
}






//////////////////////////////////////////////////////
//
//      Code below for user management/authentication
//
//////////////////////////////////////////////////////





app.get('/profile', (req, res) => {
  
  var responseOBJ = loadHTMLPage("signup.html")  
  res.set('Content-Type', 'text/html')  
  res.end(responseOBJ)
})

app.get('/profile-info',(req, res)=> {
  var token = "Auth Token Not provided"
  if(req.cookies.authtoken){
    token = req.cookies.authtoken
  }
  
  console.log(token)
  var u = new user(dataPath)
  var valid = u.validate(token)

  console.log(userInfo)
  if(valid){
    var userInfo = u.store
    delete(userInfo.hashedPassword)
    delete(userInfo.emailtoken)
    delete(userInfo.authToken)
    res.send(userInfo)
  } else {
    //Login Failed
     res.send("Invalid Auth Token... please login again!")
  }
})

app.get('/signup', (req, res) => {
  
  var responseOBJ = loadHTMLPage("signup.html")  
  res.set('Content-Type', 'text/html')  
  res.end(responseOBJ)
})

app.get('/logout', (req, res) => {
  if(req.cookies.authtoken){
    token = req.cookies.authtoken
  }
  var u = new user(dataPath)
  var valid = u.validate(token)

  if(valid){
    u.logout(token)
  }

  res.redirect("/")
})



app.post('/signup', (req, res) => {
  var doc = req.body
  var u = new user()
  u.createNewUser(doc.email, doc.password, doc.first, doc.last, doc.displayname)
  u.store.profileImage = "default.png"
  sd.saveIn("users", u.store.id, u.store)
  
  var subject = "Welcome to PixelFlux"
  var body = "Welcome to PxelFlux\r\n\r\n"
  body += "https://pixelflux.me/validate?token=" + u.store.emailtoken + "&email=" + u.store.email
  sendmail(u.store.email, subject, body)
  res.sendStatus(200)
})


app.get('/signin', (req, res) => {
  
  var responseOBJ = loadHTMLPage("signin.html")  
  res.set('Content-Type', 'text/html')  
    
  res.end(responseOBJ)
})



app.post('/signin', (req, res) => {
  
  var doc = req.body
  console.log(doc)
  var u = new user(dataPath)
  var userInfo = u.authenticate(doc.email, doc.password)
  console.log(userInfo)
  if(userInfo !== false){
    if(userInfo.emailvalidated){
      res.cookie('authtoken',userInfo.authToken, { path: "/", maxAge: 9000000, httpOnly: true });
      res.send(userInfo)
    } else {
      res.send("Please validate your email address.  Check your mail!")
    }
  } else {
    //Login Failed
     res.send("Authentication Failed... :P")
  }
})


app.get('/validate', (req, res) => {
  
  const queryObject = url.parse(req.url,true).query
  console.log(queryObject.token)

  var token = queryObject.token
  var email = queryObject.email
  
  res.set('Content-Type', 'text/html') 
  
  var u = new user(dataPath)
  if(u.validateemail(email, token)){
    res.end("Your Email address has been validated... Thank you.  Please <a href=/signin>Sign In</a> with your credentials.")
  } else {
    res.end("Your Email address could not be validated... Try to copy/paste the URL instead.")
  }
  
       
  
})






function sendmail(to, subject, body){
  var mailOptions = {
    from: 'noreply@pixelflux.me',
    to: to,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}




class user {
  constructor(dataPath){
    this.dataPath = dataPath
    this.store = {}
  }
  
  createNewUser(email, password, first, last, displayname){
    this.store.id = crypto.randomUUID()
    this.store.email = email
    this.store.hashedPassword = this.hashPass(password)
    this.store.first = first
    this.store.last = last
    this.store.displayname = displayname
    var buffer = crypto.randomBytes(48) 
    var token = buffer.toString('hex')
    this.store.emailtoken = token
    this.store.emailvalidated = false
    return this
  }
  
  load(id){
    var sd = new stashdoc.stashdoc(this.dataPath)
    this.store = sd.loadFrom('users', id)
    return true
  }
  
  save(){
    var sd = new stashdoc.stashdoc(this.dataPath)
    sd.saveIn("users", this.store.id, this.store)
  }
  
  findBy(identifier, value){
    var sd = new stashdoc.stashdoc(this.dataPath)
    var userfiles = fs.readdirSync(path.join(this.dataPath, "users"))
    userfiles.forEach((file, index)=>{
      var userInfo = sd.loadFrom("users", file)
      if(userInfo[identifier] == value)
        return this.load(userInfo.id)
    })
    return false
  }

  authenticate(email, password){
    this.findBy("email", email)
    if(this.hashPass(password) === this.store.hashedPassword){

      var buffer = crypto.randomBytes(48) 
      var token = buffer.toString('hex')

      var sessionInfo = {}
      sessionInfo.loginDate = Date.now()
      sessionInfo.id = this.store.id
      var sd = new stashdoc.stashdoc(this.dataPath)
      sd.saveIn("usersessions", token, sessionInfo)

      var userInfo = this.store
      userInfo.hashedPassword = "REDACTED"
      userInfo.authToken = token

      return userInfo
        
      
      
    } else {
      return false
    }
  }
  
  validate(token){
    if(token.length == 0)
      return false
    var sd = new stashdoc.stashdoc(this.dataPath)
    if(sd.loadFrom("usersessions", token)){
      this.load(sd.loadFrom("usersessions", token).id)
      return true
    } else {
      return false
    }
  }
  
  validateemail(email, token){
    


    this.load(email)
    
    if(this.store.emailtoken == token){
      this.store.emailvalidated = true
      this.save()
      return true
    } else {
      return false
    }
    
  }
  
  logout(token){
    fs.unlinkSync(path.join(this.dataPath, "usersessions", token))
  }

  hashPass(password){
    const hashingSecret = process.env.AUTHSECRET;
    return crypto.createHmac('sha256', hashingSecret)
                                 .update(password)
                                 .digest('hex')
  }
  
  
  
}




// MISC FUNCTIONS

function post(url, json){
  return new Promise((resolve, reject)=>{
    var postData = JSON.stringify(json);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(postData);
    xhr.onreadystatechange = (e) => {
      if(e.currentTarget.readyState == 4){
        resolve(xhr.responseText);
      }
    }
    xhr.onerror = (e) => {
      reject(e);
    }
    
  })
}



function createSitemap(req, res){
  console.log("creating site map")
  var sitemap = fs.readFileSync("./public/staticmap.xml")
  var additionalUrls = ""
  var order = "-sys.createdAt"

  var contentQuery = {
    order: order
  }

  client.getSpace(process.env.CONTENTFULSPACE).then((space) => {
    space.getEnvironment('master').then((environment) => {
      environment.getEntries(contentQuery)
      .then(function (entries) {

        entries.items.forEach(function (entry) {
          
          var type = entry.sys.contentType.sys.id
          var id = entry.sys.id

          var loc = `https://pixelflux.me/content?type=${type}&amp;doc=${id}`
          var lastmod = new Date().toISOString().split('T')[0]

          if(type != "comment" && type != "object"){
          additionalUrls += `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
          }
          
        })
      })
      .then(()=>{
        var fullSitemap = sitemap
        
        fullSitemap += additionalUrls
        fullSitemap += "\n</urlset>"
        
        res.set('Content-Type', 'text/xml')
        res.send(fullSitemap)
      })
    })
  })

}


