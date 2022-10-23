const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product');
const { rmSync } = require('fs');

mongoose.connect('mongodb://localhost:27017/farmStand')
    .then(() => {
        console.log("Mongo Connection Open!!")
    })
    .catch(err => {
        console.log("Mongo Connection Error!")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

// await mongoose using async functions
app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

//create new product route
app.get('/products/new', (req, res) => {
    res.render('products/new')
})

//route after submit the new product form
app.post('products', (req, res) => {
    console.log(req.body)
    res.send('making your product!')
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
})
app.listen(3030, () => {
    console.log("Listening on port 3030!")
})