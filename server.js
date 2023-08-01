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

const GIFEncoder = require('gif-encoder-2')
const { createCanvas, loadImage } = require('canvas')

const {OAuth2Client} = require('google-auth-library');
const oa2client = new OAuth2Client("166137424043-3aul3cvcfkuhjriajmpp7p3jt9tdmhm7.apps.googleusercontent.com");


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

const dataPath = fs.realpathSync("./data")
const sessionDBPath = path.join(dataPath, "sessions", "db.json")

var stashdoc = require('./modules/stashdoc.js')
var sd = new stashdoc.stashdoc(dataPath)

app.use(express.static('public'))
app.use(bodyParser.json({ limit: '50mb' })) // To parse the incoming requests with JSON payloads
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

app.get('/privacy', (req, res) => {
  res.send(loadHTMLPage('privacy.html'))
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
  var loggedIn = verifyGoogleToken(token).result

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

app.get('/mysprites', (req, res)=>{
  
  var token = req.cookies.googleToken ? req.cookies.googleToken : false
  
  var e400 = {
    errorCode: 400,
    errorMessage: "Sprite ID Not provided in URL Params"
  }

  var e404 = {
    errorCode: 404,
    errorMessage: "Sprite ID Not found"
  }

  var e403 = {
    errorCode: 403,
    errorMessage: "Not Logged In"
  }

  
  if(!token){
    console.log("Token not provided.", req.cookies)
    res.send(JSON.stringify(e403))
    return
  }

  

  verifyGoogleToken(token)
  .then((tokenResponse)=>{

    var loggedIn = tokenResponse.result
    var userId = tokenResponse.userId

    console.log("USER ID for SpriteList Load: " + userId)

    let userMetaPath = path.join(dataPath, "users", userId, "meta")
    console.log(userMetaPath)

    var metaFiles = fs.readdirSync(userMetaPath)
    var spriteList = new Array()
    
    metaFiles.forEach((file)=>{
      console.log(file)
      console.log(userMetaPath)
      var meta = sd.loadFrom(path.join("users", userId, "meta"), file)
        if(meta){
          spriteList.push(meta)
        }
    })

    if(spriteList.length == 0){
      res.send(JSON.stringify(e404))
      return
    } else {
      res.send(JSON.stringify(spriteList))
    }

    
  
  })

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


  var token = req.cookies.googleToken ? req.cookies.googleToken : false

  if(!token){
    console.log("Token not provided.", req.cookies)
    res.send(JSON.stringify({error: 403, message: "Token Not Set"}))
    return
  }

  verifyGoogleToken(token)
  .then((tokenResponse)=>{
    let userId = tokenResponse.userId
    var loggedIn =  tokenResponse.result
    
    if(!loggedIn){
      var errorResponse = {
        errorCode: 403,
        errorMessage: "Not Logged In or Auth Token invalid"
      }
      res.send(JSON.stringify(errorResponse))
      console.log(errorResponse)
      return

    }

    console.log(userId)
    console.log(loggedIn)
    var spriteData = sd.loadFrom(path.join("users", userId, "sprites"), id)

    if(!spriteData){
      var e = {
        errorCode: 404,
        errorMessage: "Sprite ID Not found"
      }
      res.send(JSON.stringify(e))
      return
    } else {
      res.send(JSON.stringify(spriteData))
    }


  })

  

})



app.post('/save', (req, res)=>{

  var token = req.cookies.googleToken ? req.cookies.googleToken : false

  if(!token){
    console.log("Token not provided.", req.cookies)
    res.send(JSON.stringify({error: 403, message: "Token Not Set"}))
    return
  }

  verifyGoogleToken(token)
  .then((tokenResponse)=>{

    var id = crypto.randomUUID()

    var u = new user(dataPath)
    var loggedIn =  tokenResponse.result
    var userId =  tokenResponse.userId

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

      if(!fs.existsSync(path.join(dataPath, "users", userId, "meta")))
        fs.mkdirSync(path.join(dataPath, "users", userId, "meta"))
      if(!fs.existsSync(path.join(dataPath, "users", userId, "sprites")))
        fs.mkdirSync(path.join(dataPath, "users", userId, "sprites"))

      var metaString = JSON.stringify(metaData);
      var dataString = JSON.stringify(saveData);
      
      fs.writeFileSync(path.join(dataPath, "users", userId, "meta", id), metaString)
      fs.writeFileSync(path.join(dataPath, "users", userId, "sprites", id), dataString)

      res.send("OK")
      return

    }
  })

})


// {
//    name: "sprite name",
//    width: int,
//    height: int,
//    frameCount: int,
//    frameRate: int (fps),
//    png: base64 data URL encoded PNG image
// }

app.post('/png-sheet-to-gif/*.gif', async (req, res) => {


  var token = req.cookies.googleToken ? req.cookies.googleToken : false
  
  var e400 = {
    errorCode: 400,
    errorMessage: "Sprite ID Not provided in URL Params"
  }

  var e404 = {
    errorCode: 404,
    errorMessage: "Sprite ID Not found"
  }

  var e403 = {
    errorCode: 403,
    errorMessage: "Not Logged In"
  }

  
  if(!token){
    console.log("Token not provided.", req.cookies)
    res.send(JSON.stringify(e403))
    return
  }

  

  verifyGoogleToken(token)
  .then((tokenResponse)=>{

    var loggedIn = tokenResponse.result
    var userId = tokenResponse.userId

    let spriteObj = req.body
    console.log(spriteObj)
    loadImage(spriteObj.png)
    .then(spritesheet => {

      const encoder = new GIFEncoder(spriteObj.width, spriteObj.height, 'octree', true)
      encoder.setDelay(1000 / spriteObj.frameRate)
  
      encoder.start()
      
      for(let frameNumber = 0; frameNumber < spriteObj.frameCount; frameNumber++){
        let canvas = createCanvas(spriteObj.width, spriteObj.height)
        let ctx = canvas.getContext('2d')
  
        let sx = spriteObj.width * frameNumber
        let sy = 0
        let sw = spriteObj.width
        let sh = spriteObj.height
        let dx = 0
        let dy = 0
        let dw = spriteObj.width
        let dh = spriteObj.height
  
        ctx.drawImage(spritesheet, sx, sy, sw, sh, dx, dy, dw, dh)
  
        encoder.addFrame(ctx)
  
      }
  
  
      encoder.finish()
    
      const buffer = encoder.out.getData()
  
      res.setHeader( "Content-Length", buffer.length,)
      res.setHeader( "Cache-Control", "no-cache")
      res.setHeader( "Content-Type", "application/json")
      let responseOBJ = {
        gifUrl: "/gifs/" + userId + '.gif'
      }
  
      fs.writeFileSync(path.join('./public', 'gifs', userId + '.gif'), buffer)
  
      res.send(JSON.stringify(responseOBJ))
  


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
  var responseOBJ = loadHTMLPage("profile.html")  
  res.set('Content-Type', 'text/html')  
  res.end(responseOBJ)
})

app.get('/user-preferences', (req, res) => {
  let responseOBJ = {}
  var token = req.cookies.googleToken ? req.cookies.googleToken : false
  if(!token){
    console.log("Token not provided.", req.cookies)
    res.send(JSON.stringify({error: 403, message: "Token Not Set"}))
    return
  }
  verifyGoogleToken(token)
  .then(response=>{
    //console.log("Loading User Preferences",response)
    let userId = response.userId
    //console.log("UserId:", userId)
    responseOBJ = sd.loadFrom(path.join("users", userId), "preferences")
    res.send(responseOBJ)
  })
})




app.get('/profile-info',(req, res)=> {
  var token = "Auth Token Not provided"
  var hasToken = false
  var u = new user(dataPath)
  var valid =  false
  var userId =  ""
  let response = {}
  
  if(req.cookies.googleToken){
    token = req.cookies.googleToken
    hasToken = true
  }
  
  if(hasToken){
    //console.log(token)
    verifyGoogleToken(token)
    .then(response=>{
      res.send(response)
    })

  } else {
    //Login Failed
    console.log("----- LOGIN FAILED -----")
    res.send("Invalid Auth Token... please login again!")
  }
})


app.get('/logout', (req, res) => {
  
  res.cookie('googleToken', "", { path: "/", maxAge: 9000000, httpOnly: true });  
  backURL=req.header('Referer') || '/';
  res.redirect(backURL);
})



// Handling Google Authentication
app.post('/googleValidate',(req, res)=>{
  let googleToken = req.body.googleToken
  res.cookie('googleToken', googleToken, { path: "/", maxAge: 9000000, httpOnly: true });  
  verifyGoogleToken(googleToken)
  .then(response=>{
    res.send(response)
  })

})



function verifyGoogleToken(googleToken) {

  async function verify(token){
    console.log("Verifying google token")
    let response = alreadySignedIn(token)
    
    if(!response){
      response = {}
      console.log("User not logged in so response reset!")
      let ticket = await oa2client.verifyIdToken({
        idToken: googleToken,
        audience: "166137424043-3aul3cvcfkuhjriajmpp7p3jt9tdmhm7.apps.googleusercontent.com", 
      })

      response.payload = ticket.getPayload()
      response.userId = response.payload['sub']
      response.timeStamp = Date.now()
      response.result = true
      console.log("Response now populated from Google Auth")
      //console.log(response)
    }
    //console.log(response)
    sd.updateJSONFile(sessionDBPath, "add", token, response)

    let u = new user(dataPath)
    if(!u.load(response.userId)){
      u.createNewUser(response.userId, response.payload.email, response.payload.given_name, response.payload.family_name)
      u.save()
    }   
    console.log("Verify Response: ", response)
    return response
  }

  return verify(googleToken)
  
}
  

function alreadySignedIn(token){

  console.log("Checking Login Status")
  let db = JSON.parse(fs.readFileSync(sessionDBPath))
  console.log("DB LOADED")
  console.log(db[token])
  if(db[token]){
    console.log("Token found in stash!")
    let date = Date.now()
    console.log("Timestamp NOW: " + date)
    let tokenDate = db[token].timeStamp
    console.log("Token Timestamp: " + tokenDate)
    let tokenAge = date - tokenDate
    console.log("Token Age: " + tokenAge)
    if(tokenAge < 90000000){
      console.log("already signed in as: " + db[token].userId)
      return db[token]
    }
  }
  console.log("USER NOT LOGGED IN ALREADY")
  return false
}
 


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
  
  createNewUser(id, email, first, last){
    this.store = {}
    console.log("Creating New User: ",id, email, first, last)
    this.store.id = id
    this.store.email = email
    this.store.first = first
    this.store.last = last
    console.log(this.store)
    return this
  }
  
  load(id){
    var sd = new stashdoc.stashdoc(this.dataPath)
    this.store = sd.loadFrom(path.join('users', id), "profile")
    console.log("user Loaded: ", this.store)
    if(this.store)
      return true
    else
      return false
  }
  
  save(){
    var sd = new stashdoc.stashdoc(this.dataPath)
    sd.saveIn(path.join('users', this.store.id), "profile", this.store)
  }
  
  findBy(identifier, value){
    var sd = new stashdoc.stashdoc(this.dataPath)
    var userfiles = fs.readdirSync(path.join(this.dataPath, "users"))
    userfiles.forEach((file, index)=>{
      var userInfo = sd.loadFrom(path.join('users', file), "profile")
      if(userInfo[identifier] == value)
        return this.load(userInfo.id)
    })
    return false
  }

  authenticate(id, token){
    if(!this.load(id))
      return false

    var buffer = crypto.randomBytes(256) 
    var browserToken = buffer.toString('hex')
  
    this.browserTokens.push(token)

    var userInfo = this.store
    userInfo.browserTokens = null


    return userInfo

  }
  
  validate(id, token){
    
    if(token.length == 0 || id.length == 0)
      return false

    var sd = new stashdoc.stashdoc(this.dataPath)
    if(this.load(id).browserTokens.contains(token)){
      return true
    } else {
      return false
    }
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


