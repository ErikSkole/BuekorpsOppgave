const express = require('express')
const db = require("better-sqlite3")("database.db", { verbose: console.log })
const session = require('express-session')
const bcrypt = require('bcrypt')

const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(session( {
    secret: "keep it secret",
    resave: false,
    saveUninitialized: false
}))

app.get("/", (req, res) => {
    if (req.session.logedIn !== true) {
        res.redirect("/login")
    } else {
        res.sendFile(__dirname + "/public/homePage.html")
    }
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})

app.post("/login", (req, res) => {
    const selectStmt = db.prepare("SELECT * FROM users WHERE username = ?")
    const user = selectStmt.get(req.body.username)
    if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
        req.session.user = user
        req.session.logedIn = true
        res.redirect("/")
    } else {
        res.redirect("/login")
    }
})

app.post("/createUser", (req, res) => {
    const countStmt = db.prepare("SELECT COUNT(*) AS count FROM users")
    const result = countStmt.get()
    const userCount = result.count
    const insertStmt = db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)")
    const hash = bcrypt.hashSync(req.body.password, 10)
    if (userCount === 0) {
        insertStmt.run(req.body.username, hash, "Admin")
    } else {
        insertStmt.run(req.body.username, hash, "Medlem")
    }
    res.send("User added")
})

app.get("/createUser", (req, res) => {
    res.sendFile(__dirname + "/public/createUser.html")
})

app.listen(3000, () => {
    console.log('Server started at port 3000')
})