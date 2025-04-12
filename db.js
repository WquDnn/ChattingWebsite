let mysql = require("mysql2")
require("dotenv").config()

let db = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

let asyncDB = db.promise()

async function getUsers(){
    try{
        let [rows, fields] = await asyncDB.query("select * from User")
        
        return rows
    }catch(err){
        throw err.message
    }
}



module.exports = {
    getUsers
};