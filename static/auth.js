let registerForm = document.querySelector(".register form")

registerForm.addEventListener("submit", (e)=>{
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

    .then((res)=>res.json()).then(res=>{
        if(res.status = 302) window.location("/login")
            return res.json()
        console.log(res)
    })

    }).then((res)=>res.json()).then(res=>{
        console.log(res)
    })

});