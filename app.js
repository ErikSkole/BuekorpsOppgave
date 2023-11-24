const express = require('express')
const db = require("better-sqlite3")("database.db", { verbose: console.log })

const app = express()

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})

app.post("/login", (req, res) => {
    res.send("Login er ikke implementert enda")
})

app.post("/createUser", (req, res) => {
    
})

app.get("/createUser", (req, res) => {
    res.sendFile(__dirname + "/public/createUser.html")
})

app.listen(3000, () => {
    console.log('Server started at port 3000')
})