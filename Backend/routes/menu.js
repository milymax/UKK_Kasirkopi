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
const menu = model.menu

//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", (req, res) => {
    menu.findAll()
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
app.get("/:id_menu", (req, res) => {
    menu.findOne({ where: { id_menu: req.params.id_menu } })
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
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        gambar: req.body.gambar,
        harga: req.body.harga
    }


    menu.create(data)
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
app.put("/:id_menu", (req, res) => {
    let param = {
        id_menu: req.params.id_menu
    }
    let data = {
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        gambar: req.body.gambar,
        harga: req.body.harga
    }
    menu.update(data, { where: param })
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
app.delete("/:id_menu", (req, res) => {
    let param = {
        id_menu: req.params.id_menu
    }
    menu.destroy({ where: param })
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



module.exports = app