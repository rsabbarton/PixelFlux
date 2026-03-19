

class GitHub {
    constructor (repoUrl) {
        this.repoUrl = repoUrl
    }

    renderIssuesIndex (destination) {
        // URL Example: 
        // https://api.github.com/repos/rsabbarton/PixelFlux/issues?state=open
        let apiUrl = this.repoUrl + "issues?state=open"

        this.getJSON(apiUrl)
        .then(json => this.renderIndexFromJSON(JSON.parse(json), destination))
        .catch(e => console.error(e))

    }


    renderIndexFromJSON (json, destination) {

        let output = ""

        console.log(json)

        json.forEach(issue => {
            let id = issue.id
            let url = issue.url
            let outUrl = url.replace("api.", "").replace("repos/", "")
            let title = issue.title
            let labels = ""
            let createDate = issue.created_at
            let updateDate = issue.updated_at
            let body = issue.body
            
            issue.labels.forEach(label => labels += label.name + " ")
            
            let entry = `
            <div class="indexitem">
                <div class="ghtitle"><a href="${outUrl}" target="_blank">${createDate} - ${title}</a></div> 
                <div class="ghlabels"> ( ${labels} ) </div>
                <div class="ghinfo">Last Udated: ${updateDate} - <div class="ghmoreinfo clickable" onclick="document.getElementById('body${id}').classList.toggle('ghhidden');">More Info</div>
                    <div class="ghbody ghhidden" id="body${id}"><textarea class=ghbodytext>${body}</textarea></div>
                </div>
            </div>
            `

            output += entry
        });

        destination.innerHTML = output
    }


    getJSON (url) {
        return new Promise((resolve, reject)=>{
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(null);
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
}
