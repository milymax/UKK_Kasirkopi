//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');


//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//import model
const model = require('../models/index');
const user = model.user

//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", (req, res) => {
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


//endpoint untuk menampilkan data customer berdasarkan id
app.get("/:id_user", (req, res) => {
    user.findOne({ where: { id_user: req.params.id_user } })
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


//endpoint untuk menyimpan data admin, METHOD: POST, function: create
app.post("/", (req, res) => {
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }


    user.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint mengupdate data admin, METHOD: PUT, function:update
app.put("/:id_user", (req, res) => {
    let param = {
        id_user: req.params.id_user
    }
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password)
    }
    user.update(data, { where: param })
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menghapus data admin, METHOD: DELETE, function: destroy
app.delete("/:id_user", (req, res) => {
    let param = {
        id_user: req.params.id_user
    }
    user.destroy({ where: param })
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id_user", (req, res) => {
    let param = {
        id_user: req.params.id_user
    }
    user.destroy({ where: param })
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})


//



module.exports = app