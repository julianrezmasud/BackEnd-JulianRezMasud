import express from "express";
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import __dirname from "../utils.js";

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(express.static(__dirname + '/src/public/img'))



const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`)
})


app.get('/ping', (req, res) => {
    res.send({ status: 'ok' })

})


app.use('/api/carts/', cartsRoutes)
app.use('/api/products/', productsRoutes)



