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
const meja = model.meja

//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", (req, res) => {
    meja.findAll()
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
app.get("/:id_meja", (req, res) => {
    meja.findOne({ where: { id_meja: req.params.id_meja } })
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
        meja: req.body.meja,
    }


    meja.create(data)
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
app.put("/:id_meja", (req, res) => {
    let param = {
        id_meja: req.params.id_meja
    }
    let data = {
        meja: req.body.meja,
    }
    meja.update(data, { where: param })
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
app.delete("/:id_meja", (req, res) => {
    let param = {
        id_meja: req.params.id_meja
    }
    meja.destroy({ where: param })
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