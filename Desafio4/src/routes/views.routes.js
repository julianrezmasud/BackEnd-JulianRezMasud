import express from 'express';
import { ProductManager } from "../ProductManager.js";


const router = express.Router()
let productManager = new ProductManager()



router.get('/', async (req, res) => {

    let allProducts = await productManager.getProducts()
    res.render('home', {
        title: 'Desafio 4 con Handlebars',
        products: allProducts,
        style: "style.css"
    })
})


export default router

