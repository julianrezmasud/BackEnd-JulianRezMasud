import { Router } from 'express';
import { CartManager } from "../CartManager.js";


let cartManager = new CartManager()

const router = Router()


router.get('/', async (req, res) => {
    try {
        let carts = await cartManager.getCarts()
        res.json(carts)

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error trying to get carts' });
    }
})


router.get('/:cid', async (req, res) => {
    let { cid } = req.params
    try {
        let cartId = await cartManager.getCartById(cid)

        cartId
            ? res.send({ msg: `Cart with ID ${cid} found it`, cart: cartId })
            : res.status(404).send({ error: `Cart with ID ${cid} not found` });

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error trying to get carts by ID' });
    }
})

router.post('/', async (req, res) => {
    try {
        let newPost = await cartManager.addCart()
        res.send(newPost);

    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error addign new cart' });
    }
})


router.post('/:cid/product/:pid', async (req, res) => {
    let { cid, pid } = req.params
    try {
        let newProductInCart = await cartManager.addNewProductsInCart(cid, pid)
        res.send(newProductInCart)

    } catch (error) {
        res.status(500).send({ status: 500, error: ' Error tryign to add product to Cart' });

    }
})

export default router;