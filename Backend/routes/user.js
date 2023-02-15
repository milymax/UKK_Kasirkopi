//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require("md5")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "INIKASIR"
const auth = require("../auth")

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//import model
const model = require('../models/index');
const user = model.user

//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", auth, async (req, res) => {
    user.findAll()
        .then(result => {
            res.json({
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:id", auth, async (req, res) => {
    let param = {
        id_user: req.params.id
    }
    user.findOne({ where: param })
        .then(result => {
            res.json({
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/user/:role", auth, async (req, res) => {
    let param = {
        role: req.params.role
    }
    user.findAll({ where: param })
        .then(result => {
            res.json({
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", auth, async (req, res) => {
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }
    user.create(data)
        .then(result => {
            res.json({
                message: "Data Berhasil Ditambahkan",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.put("/", auth, async (req, res) => {
    let param = {
        id_user: req.body.id_user
    }
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }
    user.update(data, { where: param })
        .then(result => {
            res.json({
                message: "Data Berhasil Diperbarui"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id", auth, async (req, res) => {
    let param = {
        id_user: req.params.id
    }
    user.destroy({ where: param })
        .then(result => {
            res.json({
                message: "Data Berhasil Dihapus"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
//LOGIN
app.post("/login", async (req, res) => {
    let param = {
        username: req.body.username,
        password: md5(req.body.password),
    }
    let result = await user.findOne({ where: param })
    if (result) {
        let payload = JSON.stringify(result)
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    } else {
        res.json({
            logged: false,
            message: "Username atau Password salah"
        })
    }
})

module.exports = app