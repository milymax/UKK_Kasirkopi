//import
const express = require('express');
const cors = require('cors');


//implementasi
const app = express();
app.use(cors());


//endpoint nanti ditambahkan di sini
const user = require('./routes/user');
const meja = require('./routes/meja');
const menu = require('./routes/menu');
const transaksi = require('./routes/transaksi');


app.use("/user", user)
app.use("/meja", meja)
app.use("/menu", menu)
app.use("/transaksi", transaksi)

//run server
app.listen(8080, () => {
    console.log('server run on port 8080')
})
