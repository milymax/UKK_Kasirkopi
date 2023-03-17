const express = require("express")
const app = express()
const moment = require("moment")
const transaksi = require("../models/index").transaksi
const detail_transaksi = require("../models/index").detail_transaksi
const meja = require("../models/index").meja
const { Op } = require('sequelize')
const { isRole } = require("../auth")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/detail", isRole(["kasir", "manajer"]), async (req, res) => {
    detail_transaksi.findAll({
        include: ["transaksi", "menu"]
    })
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

// app.get("/detail/:id", isRole(["kasir"]), async (req, res) => {
//     let param = {
//         id_transaksi: req.params.id
//     }
//     detail_transaksi.findAll({
//         include: ["transaksi", "menu"],
//         where: param
//     })
//         .then(result => {
//             res.json({
//                 data: result
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: error.message
//             })
//         })
// })

app.get("/", isRole(["kasir", "manajer"]), async (req, res) => {
    transaksi.findAll({
        include: ["user", "meja", {
            model: detail_transaksi,
            as: "detail_transaksi",
            include: "menu"
        }]
    })
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

app.get("/:id", isRole(["kasir"]), async (req, res) => {
    let param = {
        id_transaksi: req.params.id
    }
    transaksi.findAll({
        include: ["user", "meja", {
            model: detail_transaksi,
            as: "detail_transaksi"
        }],
        where: param
    })
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

// app.post("/", isRole(["kasir"]), async (req, res) => {
//     let current = new Date().toISOString().split('T')[0]
//     let data_transaksi = {
//         tgl_transaksi: current,
//         id_user: req.body.id_user,//id_user manakah yang menangani
//         id_meja: req.body.id_meja,
//         nama_pelanggan: req.body.nama_pelanggan,
//         status: req.body.status,
//     }

//     console.log(data_transaksi)
//     transaksi.create(data_transaksi)
//         .then(result => {
//             let lastID = result.id_transaksi
//             let detail = req.body.detail_transaksi
//             detail.forEach(element => {
//                 element.id_transaksi = lastID
//             });

//             console.log(detail)
//             detail_transaksi.bulkCreate(detail)
//             res.json({
//                 message: "Data Berhasil Ditambahkan",
//                 data: result
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: error.message
//             })
//         })
// })

// POST TRANSAKSI, METHOD: POST, FUNCTION: create
// POST DETAIL TRANSAKSI, METHOD: POST, FUNCTION: bulkCreate
app.post("/", isRole('kasir'), async (req, res) => {
    let current = new Date().toISOString().split('T')[0]
    let data = {
        tgl_transaksi: current, //current : 
        id_user: req.body.id_user, //siapa customer yang beli
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status: "Belum bayar",
        total: 0 // inisialisasi nilai total awal
    }
    let param = { id_meja: req.body.id_meja }

    // Periksa apakah meja tersedia atau tidak
    let mejaData = await meja.findOne({
        where: { id_meja: req.body.id_meja, available: "Yes" },
    });
    if (!mejaData) {
        return res.json({
            message: "Meja tidak tersedia",
        });
    }

    // Periksa apakah meja masih digunakan atau tidak
    let transaksiData = await transaksi.findOne({
        where: { id_meja: req.body.id_meja, status: "Belum bayar" },
    });
    if (transaksiData) {
        return res.json({
            message: "Meja masih digunakan",
        });
    }
    let upMeja = {
        available: "No"
    }
    await meja.update(upMeja, { where: param })
    await transaksi.create(data)
        .then(result => {
            let lastID = result.id_transaksi
            console.log(lastID)
            detail = req.body.detail_transaksi
            let total = 0
            detail.forEach(element => {
                element.id_transaksi = lastID
                element.subtotal = element.qty * element.harga
                total += element.subtotal
            });
            console.log(detail);
            detail_transaksi.bulkCreate(detail)
                .then(result => {
                    transaksi.update({ total: total }, { where: { id_transaksi: lastID } })
                        .then(result => {
                            res.json({
                                message: "Data has been inserted"
                            })
                        })
                        .catch(error => {
                            res.json({
                                message: error.message
                            })
                        })
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        })
        .catch(error => {
            console.log(error.message);
        })
})

app.put("/:id_transaksi", isRole(["kasir"]), async (req, res) => {
    let param = {
        id_transaksi: req.params.id_transaksi
    }
    let data_transaksi = {
        id_user: req.body.id_user, //id_user manakah yang menangani
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        // id_meja: req.body.id_meja, available: "Yes",
        status: req.body.status,
        // total: req.body.total,
        // subtotal: req.body.subtotal,
        // dibayar: req.body.dibayar
    }
    transaksi.update(data_transaksi, { where: param })
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

app.delete("/:id", isRole(["kasir"]), async (req, res) => {
    let param = {
        id_transaksi: req.params.id
    }
    try {
        await detail_transaksi.destroy({ where: param })
        await transaksi.destroy({ where: param })
        res.json({
            message: "data berhasil dihapus"
        })
    } catch (error) {
        res.json({
            message: error
        })
    }

})


//get data transaksi by date
app.post("/date", isRole(["manajer"]), async (req, res) => {
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)

    let result = await transaksi.findAll({
        where: {
            // id_user: req.params.id_user,
            // total: "lunas",

            tgl_transaksi: {
                [Op.between]: [
                    start, end
                ]
            }
        },
        include: [
            "user",
            "meja",
            {
                model: detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['createdAt', 'DESC']],

    })
    let sumTotal = await transaksi.sum("total", {
        where: {
            // id_user: req.params.id_user,
            tgl_transaksi: {
                [Op.between]: [
                    start, end
                ]
            }
        }
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
})


module.exports = app