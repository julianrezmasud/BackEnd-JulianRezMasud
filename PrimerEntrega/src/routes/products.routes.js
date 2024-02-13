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
                return res.status(400).json({ error: `The límit hast to be  equal or less than the quantity of the products`, cantidad_productos: `${quantProducts}` });
            }
            products = products.slice(0, limit);
            res.json({ msg: `Watching at ${products.length} all ${quantProducts} products`, products: products });
        } else {
            res.json(products)
        }


    } catch (error) {
        res.status(500).send({ status: 500, error: ' Cant show all products' });
    }

})


//? GET PARA BUSCAR Y MOSTRAR UN PRODUCTO POR SU ID MEDIANTE REQ.PARAMS
router.get('/:pid', async (req, res) => {

    let { pid } = req.params
    try {
        let idProduct = await productManager.getProductById(pid)
        idProduct
            ? res.send({ msg: `Product by ID: ${pid} not found`, Product: idProduct })
            : res.send({ error: `Product by ID: ${pid} not found:(` })

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error trying trying to show a product by ID' });
    }

})

router.post('/', async (req, res) => {
    let newProduct = req.body
    try {
        let newPost = await productManager.addProduct(newProduct)
        newPost
            ? res.json(newPost)
            : res.status(404).send({ error: `Product by ID ${pid} cannot add correctly` })

    } catch (error) {
        res.status(500).send({ status: 500, error: `El codigo del producto ingresado ya existe.`, msg: ' Error al querer agregar un producto' });
    }
})

router.put('/:pid', async (req, res) => {
    let { pid } = req.params
    let productUpdate = req.body
    try {
        if (productUpdate.id !== pid) return res.status(404).send({ error: `Product by ID ${pid} not found` })

        let updated = await productManager.updateProduct(productUpdate)
        res.send({ msg: `Product by ID ${pid} been modified`, products: updated })

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error trying to edited product' });
    }
})

router.delete('/:pid', async (req, res) => {

    let { pid } = req.params

    try {
        let idProduct = await productManager.deleteProduct(pid)
        console.log("Get it", idProduct)
        idProduct
            ? res.send({ msg: `Product by ID ${pid} deleted success` })
            : res.send({ msg: `Product bot Found` })

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error trying to eliminate a product' });
    }
})


export default router;


