const express = require("express")
const app = express()
const menu = require("../models/index").menu
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { Op } = require("sequelize")

const { isRole } = require("../auth")
const SECRET_KEY = "INIPUNYAKASIR"

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./img")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({ storage: storage })


app.get("/", isRole(["admin"]), async (req, res) => {
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

app.get("/:id", isRole(["admin"]), async (req, res) => {
    let param = {
        id_menu: req.params.id
    }
    menu.findOne({ where: param })
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

app.post("/", upload.single("gambar"), isRole(["admin"]), async (req, res) => {
    if (!req.file) {
        res.json({
            message: "File Tidak Ada!"
        })
    } else {
        let data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            gambar: req.file.filename,
            harga: req.body.harga
        }
        menu.create(data)
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
    }
})

app.put("/:id_menu", upload.single("gambar"), isRole(["admin"]), auth, async (req, res) => {
    let param = {
        id_menu: req.params.id_menu
    }
    let data = {
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga
    }
    if (req.file) {
        // get data by id
        const row = menu.findOne({ where: param })
            .then(result => {
                let oldFileName = result.gambar

                // delete old file
                let dir = path.join(__dirname, "../img", oldFileName)
                fs.unlink(dir, err => console.log(err))
            })
            .catch(error => {
                console.log(error.message);
            })

        // set new filename
        data.gambar = req.file.filename
    }
    menu.update(data, { where: param })
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

app.delete("/:id", auth, isRole(["admin"]), async (req, res) => {
    try {
        let param = { id_menu: req.params.id }
        let result = await menu.findOne({ where: param })
        let oldFileName = result.gambar

        // delete old file
        let dir = path.join(__dirname, "../img", oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        menu.destroy({ where: param })
            .then(result => {

                res.json({
                    message: "data berhasil dihapus",
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})
//\ !----------------------------------------------------------------------------------------------------
//search for menu, method:post

app.post("/search/:keyword", async (req, res) => {
    let keyword = req.params.keyword //keyword?
    let result = await menu.findAll({
        where: {
            [Op.or]: [
                {
                    id_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    jenis: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    deskripsi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    harga: {
                        [Op.like]: `%${keyword}%`
                    }
                },
            ]
        }
    })
    res.json({
        menu: result
    })
})

//\!---------------------------------------------------------------------------------------------------- 

//mendapatkan menu terlaris
app.get("/terlaris", isRole(["manajer"]), async (req, res) => {
    try {
        const result = await detail_transaksi.findAll({
            attributes: [
                'id_menu',
                [models.sequelize.fn('sum', models.sequelize.col('qty')), 'total_penjualan']
            ],
            include: [
                {
                    model: menu,
                    as: 'menu',
                    // where: { jenis: 'makanan' },
                    attributes: ['nama_menu']
                }
            ],
            group: ['id_menu'],
            order: [[models.sequelize.fn('sum', models.sequelize.col('qty')), 'DESC']]
        });
        res.status(200).json({ menu: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = app