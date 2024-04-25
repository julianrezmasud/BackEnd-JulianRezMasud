// import { Router } from 'express';
// import { passportCall } from "../utils.js";


// import {getViewProductsControllers, getViewOneProductControllers} from '../controllers/viewProducts.controller.js';


// const router = Router()

// // GET ALL PRODUCTS CON PAGINATION
// // EJ: http://localhost:8080/products?page=1
// router.get('/', getViewProductsControllers, passportCall('jwt'))


// // GET ONE PRODUCT
// //EJ: http://localhost:8080/products/product/65f39b4e3942d59690fbe26f
// router.get('/product/:pid', getViewOneProductControllers)

// export default router;


//! RESOLVER: PODER GENERAR CAPA VIEWPRODUCTS.CONTROLLER SIN ERROR.


import { Router } from 'express';
import { passportCall } from "../utils.js";

const router = Router()


//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { ProductService } from "../services/filesystem/product.service.js";
//*DB
import ProductService from "../services/db/product.service.js";
import { productsModel } from '../services/db/models/products.model.js';


let productService = new ProductService()


//*PAGINATION con HB. VISTA DE TODOS LOS PRODUCTOS
// EJ: http://localhost:8080/products?page=1

router.get('/', passportCall('jwt'), async (req, res) => {

    // default page
    let page = parseInt(req.query.page);
    if (!page) page = 1;


    // sort filter
    let sort = req.query.sort;
    let sortFilter = {}
    if (sort === 'des') {
        sortFilter = { price: -1 };
    } else if (sort === 'asc') {
        sortFilter = { price: 1 };
    }

    //query filter
    let search = req.query.search
    let categoryFilter = {}
    categoryFilter = { category: search }



    try {


        let result = await productsModel.paginate({}, { page, limit: 6, lean: true, sort: sortFilter })

        result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : '';
        result.isValid = !(page < 1 || page > result.totalPages)


        // buscar por orden de precio ---  http://localhost:8080/products?page=1&sort=asc
        if (sort) {
            result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}&sort=${sort}` : '';
            result.nextLink = result.hasNextPage ? `?page=${result.nextPage}&sort=${sort}` : '';
            result.isValid = !(page < 1 || page > result.totalPages)
        }


        // buscar por categoria ("Usado" / "Nuevos") ---   http://localhost:8080/products?page=1&search=Usado
        if (search) {
            result = await productsModel.paginate(categoryFilter, { page, limit: 6, lean: true, sort: sortFilter })

            result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}&search=${search}` : '';
            result.nextLink = result.hasNextPage ? `?page=${result.nextPage}&search=${search}` : '';
            result.isValid = !(page < 1 || page > result.totalPages)

            // buscar por categoria y por orden de precio ---  http://localhost:8080/products?page=1&search=Usado&sort=asc
            if (sort) {
                result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}&search=${search}&sort=${sort}` : '';
                result.nextLink = result.hasNextPage ? `?page=${result.nextPage}&search=${search}&sort=${sort}` : '';
                result.isValid = !(page < 1 || page > result.totalPages)
            }
        }

        res.render('products', {
            title: "Vista | Productos",
            styleProds: "styleProducts.css",
            user: req.user,
            products: result.docs,
            totalDocs: result.totalDocs,
            currentPage: result.page,
            totalPages: result.totalPages,
            prevLink: result.prevLink,
            nextLink: result.nextLink,
            isValid: result.isValid
        })

        console.log("USURUIOOOOOOO " + req.user.name)

    } catch (error) {
        console.error("Error al obtener productos paginados:", error);
        res.status(500).send("Error interno del servidor");
    }
})

//* VISTA DE UN SOLO PRODUCTO
//EJ: http://localhost:8080/products/product/65f39b4e3942d59690fbe26f

router.get('/product/:pid', async (req, res) => {

    let { pid } = req.params;


    try {
        let product = await productService.getProductById(pid);
        if (!product) {
            res.status(404).send({ status: 404, error: 'No se encontró el producto' });
            return;
        }
        res.render('product', {
            title: "Vista | Producto",
            product: product.map(item => ({
                title: item.title,
                price: item.price,
                description: item.description,
                code: item.code,
                status: item.status,
                stock: item.stock,
                category: item.category,
                thumbnails: item.thumbnails
            }))
        });

    } catch (error) {
        console.error('Error al obtener el producto por su ID:', error);
        res.status(500).send({ status: 500, error: 'Error al obtener el producto por su ID' });
    }

})


export default router;

