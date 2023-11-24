const express = require('express')
const db = require("better-sqlite3")("database.db", { verbose: console.log })
const session = require('express-session')

const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(session( {
    secret: "keep it secret",
    resave: false,
    saveUninitialized: false
}))

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
    const insertStmt = db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)")
    insertStmt.run(req.body.username, req.body.password, "Medlem")
    res.send("User added")
})

app.get("/createUser", (req, res) => {
    res.sendFile(__dirname + "/public/createUser.html")
})

app.listen(3000, () => {
    console.log('Server started at port 3000')
})