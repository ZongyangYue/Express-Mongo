const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError')


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
app.use(methodOverride('_method'));

// await mongoose using async functions
app.get('/products', async (req, res, next) => {
    try {
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category })
            res.render('products/index', { products, category })
        } else {
            const products = await Product.find({})
            res.render('products/index', { products, category: "All" })
        }
    } catch (e) {
        next(e);
    }


})

//create new product route
app.get('/products/new', (req, res) => {
    res.render('products/new')
})

//route after submit the new product form
app.post('/products', async (req, res, next) => {
    try {
        const newProduct = new Product(req.body)
        await newProduct.save()
        res.redirect(`/products/${newProduct._id}`)
    } catch (e) {
        next(e);
    }



})

app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
        if (!product) {
            throw new AppError('Product Not Found', 404);
        }
        res.render('products/show', { product })
    } catch (e) {
        next(e);
    }

})

//route to the edit product form
app.get('/products/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            throw new AppError('Product Not Found', 404);
        }
        res.render('products/edit', { product })
    } catch (e) {
        next(e);
    }

})

app.put('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
        res.redirect(`/products/${product._id}`)
    } catch (e) {
        next(e);
    }

})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');

})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message);
})

app.listen(3030, () => {
    console.log("Listening on port 3030!")
})