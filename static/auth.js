let registerForm = document.querySelector(".register form")

registerForm?.addEventListener("submit", (e)=>{
    e.preventDefault()
    let data = new FormData(e.target)
    let login = data.get("login")
    let password = data.get("password")
    let passwordR = data.get("passwordR")
    if (password !== passwordR) {
        alert("kys.")
        return
    }

    if(password.length < 2 || login.length < 2){
        alert("no stop you are too korotki, write bilshi")
    }
    fetch("/api/register", {
        method: "post",
        body: JSON.stringify({login, password})

    }).then(res=>res.json()).then(res=>{
        window.location = "/login"
    })
})

let loginForm = document.querySelector(".login form")

loginForm?.addEventListener("submit", (e)=>{
    e.preventDefault()
    let data = new FormData(e.target)
    let login = data.get("login")
    let password = data.get("password")
    let passwordR = data.get("passwordR")


    if(password.length < 2 || login.length < 2){
        alert("no stop you are too korotki, write bilshi")
    }
    fetch("/api/login", {
        method: "post",
        body: JSON.stringify({login, password})

    }).then(res=>res.json()).then(res=>{
        if(res.status == "ok"){
            document.cookie = "token=" + res.token
            window.location = "/"
        }
       
    })
})