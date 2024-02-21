import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars'

import cartsRoutes from './routes/carts.routes.js';
import viewRoutes from './routes/views.routes.js';
import viewSocketsRoutes from './routes/viewsSocket.routes.js';
import { Server } from 'socket.io';


const app = express();

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`)
})

export const ioServer = new Server(httpServer)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



app.get('/ping', (req, res) => {
    res.send({ status: 'ok' })
    console.log(__dirname);
})


app.use('/api/carts/', cartsRoutes)


app.use('/api/products/', viewRoutes)


app.use('/realtimeproducts/', viewSocketsRoutes)

