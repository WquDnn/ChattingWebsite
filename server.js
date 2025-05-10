require("dotenv").config()
let db = require("./db")
let http = require("http")
let path = require("path")
let fs = require("fs")
let { Server } = require("socket.io")
const { request } = require("https")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")

let pathToIndex = path.join(__dirname, "static", "index.html")
let index = fs.readFileSync(pathToIndex, "utf-8")

let pathToStyle = path.join(__dirname, "static", "style.css")
let style = fs.readFileSync(pathToStyle, "utf-8")

let pathToAuth = path.join(__dirname, "static", "auth.js")
let auth = fs.readFileSync(pathToAuth, "utf-8")

let pathtoRegister = path.join(__dirname, "static", "register.html")
let register = fs.readFileSync(pathtoRegister, "utf-8")

let pathtoLogin = path.join(__dirname, "static", "login.html")
let loginPage = fs.readFileSync(pathtoLogin, "utf-8")

let pathToScript = path.join(__dirname, "static", "script.js")
let script = fs.readFileSync(pathToScript, "utf-8")

let ser = http.createServer((req, res) => {
    switch (req.url) {
        case "/":
            res.writeHead(200, { "content-type": "text/html" })
            res.end(index)
            break;
        case "/register":
            res.writeHead(200, { "content-type": "text/html" })
            res.end(register)
            break;
            case "/login":
                res.writeHead(200, { "content-type": "text/html" })
                res.end(loginPage)
                break;
        case "/style.css":
            res.writeHead(200, { "content-type": "text/css" })
            res.end(style)
            break;
        case "/script.js":
            res.writeHead(200, { "content-type": "text/js" })
            res.end(script)
            break;
        case "/auth.js":
            res.writeHead(200, { "content-type": "text/js" })
            res.end(auth)
            break;
        case "/api/register":
            let data = ""
            req.on("data", chunk => data += chunk)
            req.on("end", async () => {
                data = JSON.parse(data)
                console.log(data)
                let hash = await bcrypt.hash(data.password, 10)
                if(await db.checkExists(data.login)){
                    res.end("User exists")
                    return
                }

                await db.addUser(data.login, hash)
                
                res.end(JSON.stringify({link: '/login' }))

            })  
            break;
              case "/api/login":
            let data1 = "";
            req.on("data", (chunk) => (data1 += chunk))
            req.on("end", async () => {
               let {login, password} = JSON.parse(data1)
               let info = await db.GetUser(login)
               if(info.length == 0){
                res.end({status: "nepraviln vvediniye dANI KYS Pbyd laska"})
                return
               }
               if(await bcrypt.compare(password, info[0].password)){
                let token = jwt.sign({login, id: info[0].id}, "apple", {expiresIn: "1h"})

                res.end(JSON.stringify({status: "ok", token}))
               }else{
                res.end(JSON.stringify({status: "danni vvedeno ne coretly"}))
               }

            })  
            break;
        default:
            res.writeHead(404, { "content-type": "text/html" })
            res.end("<h1>404 not found</h1>")
    }
}).listen(3000, () => console.log("Server is on!"))

let io = new Server(ser);

io.on("connection", async function (s) {
    console.log(s.id)
    let messages = await db.getMessages()
    messages = messages.map(m => ({ name: m.login, text: m.content }))
    io.emit("update", JSON.stringify(messages))
    s.on("message", async (data) => {
        data = JSON.parse(data)
        await db.addMessage(data.text, 1)
        let messages = await db.getMessages();
        messages = messages.map(m => ({ name: m.login, text: m.content }))
        io.emit("update", JSON.stringify(messages))


    })
})

