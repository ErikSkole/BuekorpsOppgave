const express = require('express')
const db = require("better-sqlite3")("database.db", { verbose: console.log })
const session = require('express-session')
const bcrypt = require('bcrypt')

const app = express()

const isAdmin = false
const isLeder = false

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "keep it secret",
    resave: false,
    saveUninitialized: false
}))

app.get("/login", (req, res) => {
    if (req.session.logedIn !== true) {
        res.sendFile(__dirname + "/public/login.html")
    } else {
        res.redirect("/")
    }
})

app.get("/createUser", (req, res) => {
    if (req.session.logedIn !== true) {
        res.sendFile(__dirname + "/public/createUser.html")
    } else {
        res.redirect("/")
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy()
    console.log("user logged out")
    res.redirect("/")
})

app.post("/login", (req, res) => {
    const selectStmt = db.prepare("SELECT * FROM users WHERE username = ?")
    const user = selectStmt.get(req.body.username)
    if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
        req.session.user = user
        req.session.logedIn = true
        res.redirect("/")
    } else {
        console.log("wrong username or password")
        res.redirect("/login")
    }
})

app.post("/createUser", (req, res) => {
    const countStmt = db.prepare("SELECT COUNT(*) AS count FROM users")
    const result = countStmt.get()
    const userCount = result.count
    const insertStmt = db.prepare("INSERT INTO users (first_name, last_name, phone, email, username, password_hash, role, platoons_platoon_id, platoons_company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    const hash = bcrypt.hashSync(req.body.password, 10)
    let platoon_id = parseInt(req.body.platoon, 10)
    let company_id = parseInt(req.body.company, 10)
    if (company_id === 2) {
        platoon_id += 2
    }
    if (userCount === 0) { // First user created becomes admin
        insertStmt.run(req.body.firstName, req.body.lastName, req.body.tlf, req.body.email, req.body.username, hash, "Admin", platoon_id, company_id)
    } else { // All other users become members
        insertStmt.run(req.body.firstName, req.body.lastName, req.body.tlf, req.body.email, req.body.username, hash, "Medlem", platoon_id, company_id)
    }
    res.redirect("/login")
})

app.use((req, res, next) => { // Middleware to check if user is logged in
    if (req.session.logedIn === true) {
        console.log("user logged in")
        next()
    } else {
        res.redirect("/login")
    }
})

app.get("/", (req, res) => {
    if (req.session.user.role === "Admin") {
        const isAdmin = true
        res.sendFile(__dirname + "/public/admin.html")
    } else if (req.session.user.role === "Leder") {
        const isLeder = true
        res.sendFile(__dirname + "/public/leder.html")
    } else {
        res.sendFile(__dirname + "/public/medlem.html")
    }
})

app.get("/leder", (req, res) => {
    if(isLeder === true) {
        res.sendFile(__dirname + "/public/leder.html")
    } else {
        res.redirect("/")
    }
})

app.get("/admin", (req, res) => {
    if (isAdmin === true) {
        res.sendFile(__dirname + "/public/admin.html")
    } else {
        res.redirect("/")
    }
})

app.get("/users", (req, res) => {
    const selectStmt = db.prepare("SELECT * FROM users INNER JOIN platoons ON users.platoons_platoon_id = platoons.platoon_id")
    const users = selectStmt.all(req.session.user)
    res.json(users)
});

app.get('/current-user', (req, res) => {
    res.json(req.session.user);
});

app.post("/updateUser", (req, res) => {
    const updateStmt = db.prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ?, email = ?, username = ?, role = ?, password_hash = ?, platoons_platoon_id = ?, platoons_company_id = ? WHERE username = ?")
    const hash = bcrypt.hashSync(req.body.password, 10)
    let platoon_id = parseInt(req.body.platoon, 10)
    let company_id = parseInt(req.body.company, 10)
    if (company_id === 2) {
        platoon_id += 2
    }
    updateStmt.run(req.body.firstName, req.body.lastName, req.body.tlf, req.body.email, req.body.username, req.body.role, hash, platoon_id, company_id, req.body.currentUsername)
    console.log("user updated")
    res.redirect("/admin")
});

app.post("/updateUserMedlem", (req, res) => {
    const updateStmt = db.prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ?, email = ?, username = ?, password_hash = ? WHERE username = ?")
    const hash = bcrypt.hashSync(req.body.password, 10)
    updateStmt.run(req.body.firstName, req.body.lastName, req.body.tlf, req.body.email, req.body.username, hash, req.body.currentUsername)
    console.log("user updated")
    res.redirect("/")
})

app.post("/createUserAdmin", (req, res) => {
    const countStmt = db.prepare("SELECT COUNT(*) AS count FROM users")
    const result = countStmt.get()
    const userCount = result.count
    const insertStmt = db.prepare("INSERT INTO users (first_name, last_name, phone, email, username, password_hash, role, platoons_platoon_id, platoons_company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    const hash = bcrypt.hashSync(req.body.password, 10)
    let platoon_id = parseInt(req.body.platoon, 10)
    let company_id = parseInt(req.body.company, 10)
    if (company_id === 2) {
        platoon_id += 2
    }
    insertStmt.run(req.body.firstName, req.body.lastName, req.body.tlf, req.body.email, req.body.username, hash, req.body.role, platoon_id, company_id)
    res.redirect("/")
})

app.delete("/deleteUser/:id", (req, res) => {
    let id = req.params.id
    const deleteStmt = db.prepare("DELETE FROM users WHERE user_id = ?")
    deleteStmt.run(id)
    res.redirect("/")
})

app.listen(3000, () => {
    console.log('Server started at port 3000')
})