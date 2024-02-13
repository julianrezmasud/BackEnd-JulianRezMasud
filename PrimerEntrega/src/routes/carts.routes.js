import { Router } from 'express';
import { CartManager } from "../CartManager.js";


let cartManager = new CartManager()

const router = Router()




//? GET PARA MOSTRAR TODOS LOS CARRITOS
router.get('/', async (req, res) => {
    try {
        let carts = await cartManager.getCarts()
        res.json(carts)

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error at get Cart' });
    }
})

//? GET PARA BUSCAR Y MOSTRAR UN CARRITO POR SU ID MEDIANTE REQ.PARAMS
router.get('/:cid', async (req, res) => {
    let { cid } = req.params
    try {
        let cartId = await cartManager.getCartById(cid)

        cartId
            ? res.send({ msg: `Cart by ID ${cid} found it`, cart: cartId })
            : res.status(404).send({ error: `Cart with ID ${cid} not found` });

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error at getting carts by ID' });
    }
})

router.post('/', async (req, res) => {
    try {
        let newPost = await cartManager.addCart()
        res.send(newPost);

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error trying to add new cart' });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    let { cid, pid } = req.params
    try {
        let newProductInCart = await cartManager.addNewProductsInCart(cid, pid)
        res.send(newProductInCart)

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error trying to add a product to cart' });

    }
})

export default router;