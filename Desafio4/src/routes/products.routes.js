import { Router } from 'express';
import { ProductManager } from "../ProductManager.js";


let productManager = new ProductManager()


const router = Router()


router.get('/', async (req, res) => {
    try {
        let products = await productManager.getProducts()
        let quantProducts = products.length;


        let limit = parseInt(req.query.limit)

        if (!isNaN(limit) && limit > 0) {

            if (limit > quantProducts) {
                return res.status(400).json({ error: `Same or less quantity products`, cantidad_productos: `${quantProducts}` });
            }
            products = products.slice(0, limit);
            res.json({ msg: `Watching ${products.length} at ${quantProducts} products`, products: products });
        } else {
            res.json(products)
        }


    } catch (error) {
        res.status(500).send({ status: 500, error: ' Cant show products' });
    }

})


router.get('/:pid', async (req, res) => {

    let { pid } = req.params
    try {
        let idProduct = await productManager.getProductById(pid)
        idProduct
            ? res.send({ msg: `Product with ID: ${pid} found it`, Product: idProduct })
            : res.send({ error: `Product with ID: ${pid} not found:(` })

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error trying to show a product with ID' });
    }

})


router.post('/', async (req, res) => {
    let newProduct = req.body
    try {
        let newPost = await productManager.addProduct(newProduct)
        newPost
            ? res.json(newPost)
            : res.status(404).send({ error: `Product with ID ${pid} cant added succesfuly` })

    } catch (error) {
        res.status(500).send({ status: 500, error: `El codigo del producto ingresado ya existe.`, msg: ' Error trying to add a product' });
    }
})


router.put('/:pid', async (req, res) => {
    let { pid } = req.params
    let productUpdate = req.body
    try {
        if (productUpdate.id !== pid) return res.status(404).send({ error: `Product with ID ${pid} not found` })

        let updated = await productManager.updateProduct(productUpdate)
        res.send({ msg: `Product with ID ${pid} has been modify`, products: updated })

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error trying to edit a product' });
    }
})


router.delete('/:pid', async (req, res) => {

    let { pid } = req.params

    try {
        let idProduct = await productManager.deleteProduct(pid)
        console.log("What you get", idProduct)
        idProduct
            ? res.send({ msg: `Product with Id ${pid} deleted sucess` })
            : res.send({ msg: `Product not found` })

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error trying to delet product' });
    }
})


export default router;


