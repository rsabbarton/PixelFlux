
class SiteUser {
    constructor(elementId){
        this.elementId = elementId
        this.email = null
        this.displayName = null
        this.loggedIn = false
        this.profileImageUrl = ""
        
        get("/profile-info")
        .then((response)=>{
            //console.log(response)
            if(response.includes('Invalid')) {
                this.loggedIn = false
                document.getElementById("google-button").style.display = "block"
                return
            }
            response = JSON.parse(response) ?? false
            this.import(response)
        }).catch((error)=>{
            this.loggedIn = false
            console.log(error)
        })
    }

    renderProfileInfo(){

        let userinfo = document.createElement("span")
        let displayName = document.createElement("a")
        displayName.innerHTML = this.displayName
        displayName.href = "/profile"

        let pic = document.createElement("img")
        pic.onerror = ()=>{pic.src = "/resources/profile-pictures/default.png"}
        pic.src = this.profileImageUrl
        
        let logout = document.createElement("a")
        logout.href = "/logout"
        logout.innerHTML = "Log Out"
        
        userinfo.appendChild(displayName)
        userinfo.appendChild(pic)
        userinfo.appendChild(logout)
        
        var container = document.getElementById(this.elementId)
        container.innerHTML = ""
        container.appendChild(userinfo)
        
    }


    import(g){
        this.email = g.payload.email
        this.displayName = g.payload.given_name
        this.profileImageUrl = g.payload.picture
        document.getElementById("google-button").style.display = "none"       
        this.renderProfileInfo()
    }
}



const siteUser = new SiteUser("accountinfo")

