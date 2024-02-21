import express from 'express';
import { ProductManager } from "../ProductManager.js";
import { ioServer } from '../app.js'

const socketRouter = express.Router()
let productManager = new ProductManager()




socketRouter.get('/', async (req, res) => {


    let allProducts = await productManager.getProducts()
    res.render('realTimeProducts', {
        title: "Desafio 4/ Websockets",
        products: allProducts,
        style: "style.css"
    });

    ioServer.on('connection', (socket) => {
        console.log('New client connect it')

        socket.on('logmessage', (data) => {
            console.log(data)
            ioServer.emit('status', 'conected with socketServer server')
        })



        socket.on('getProduct', async (data) => {
            let productById = await productManager.getProductById(data);
            if (data === "") {

                ioServer.emit('getProduct', {
                    message: "All products checked",
                    products: await productManager.getProducts()
                });

            } else if (!productById.id) {
                ioServer.emit('getProduct', {
                    message: `Product ${data} not found`,
                    products: await productManager.getProducts()
                });
            } else {
                ioServer.emit('getProduct', {
                    message: "Consult success",
                    products: [productById],
                });
            }
        });


        socket.on('addProduct', async (data) => {
            //let addProduct = await productManager.addProduct(JSON.parse(data))
            let addProduct = JSON.parse(data)


            if (!addProduct.title || !addProduct.price || !addProduct.description || !addProduct.code || !addProduct.status || !addProduct.stock || !addProduct.category) {
                ioServer.emit('addProduct', {
                    message: "Must comlete all product lines",
                    products: await productManager.getProducts()
                });
                return;
            }

            let allProducts = await productManager.getProducts()
            const uniqueCode = allProducts.some(prod => prod.code === addProduct.code);

            if (uniqueCode) {
                ioServer.emit('addProduct', {
                    message: 'The code entered ' + [addProduct.code] + ' already exist.',
                    products: await productManager.getProducts()
                });
                return;
            }



            await productManager.addProduct(addProduct)
            ioServer.emit('addProduct', {
                message: [addProduct.title] + ' added',
                products: await productManager.getProducts()
            });
        });


        socket.on('deleteProduct', async (data) => {
            let deleteProduct = await productManager.deleteProduct(data)

            if (!deleteProduct) {
                ioServer.emit('deleteProduct', {
                    message: `Id product ${data} not found`,
                    products: await productManager.getProducts()
                });

            } else {

                ioServer.emit('deleteProduct', {
                    message: `Id product ${data} deleted`,
                    products: await productManager.getProducts()
                });
            }
        });


    });

});



export default socketRouter