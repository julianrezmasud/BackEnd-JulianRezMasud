import express from "express";
import { ProductManager } from "./ProductManager.js";
let productManager = new ProductManager()


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`)
})

app.get('/products', async (req, res) => {

    let products = await productManager.getProducts()

    let limit = parseInt(req.query.limit)

    try {
        let productLimit = products.slice(0, limit)

        !limit ? res.json({ products }) :
            res.send({ msg: `You are watching ${limit} the ${products.length} products`, productLimit })

    } catch (error) {
        console.log('!!!!!!!!!!!!!!!! ' + error)
        return res.status(500).send({ status: "500", error: "Server Problems", return: 'Link to go back' })
    }
})

app.get('/products/:pid', async (req, res) => {

    let { pid } = req.params

    try {
        let products = await productManager.getProducts()
        const productId = await products.find(prod => prod.id === parseInt(pid))
        productId ? res.json({ productId }) :
            res.status(202).send({ status: 'info', msg: ` The Requires Id ${pid} doesn't exist` })

    } catch (error) {
        console.log('!!!!!!!!!!!!!!!! ' + error)
        return res.status(500).send({ status: "500", error: "Error Detected", return: 'Link to go back' })
    }

})







