import express from "express";
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';


const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`)
})


app.get('/ping', (req, res) => {
    res.send({ status: 'ok' })
    console.log(__dirname);
})


app.use('/api/carts/', cartsRoutes)
app.use('/api/products/', productsRoutes)



