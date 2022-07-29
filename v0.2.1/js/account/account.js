
class SiteUser {
    constructor(elementId){
        this.elementId = elementId
        this.email = null
        this.displayName = null
        this.loggedIn = false
        this.profileImageUrl = ""
        this.originalHTML = document.getElementById(elementId).innerHTML


        get("/profile-info")
        .then((response)=>{
            //console.log(response)
            if(response.includes('Invalid')) {
                this.loggedIn = false
                return
            }
            response = JSON.parse(response) ?? false
            this.email = response.email
            this.displayName = response.displayname
            this.loggedIn = true
            this.profileImageUrl = "/resources/profile-pictures/" + response.email + ".png"
            this.renderProfileInfo()
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

    restoreOriginalHTML(){
        document.getElementById(this.elementId).innerHTML = this.originalHTML
    }
}



const siteUser = new SiteUser("accountinfo")