import { Router } from "express";

const router = Router();

//? Si queremos cambiar de persistencia - solo descomentar/comentar
//*FS
//import { ProductService } from "../services/filesystem/product.service.js";
//*DB
import ProductService from "../services/db/product.service.js";

let productService = new ProductService();





export const getProductDataControllers = async (req, res) => {
    try {
        let products = await productService.getProducts();
        let quantProducts = products.length;

        let limit = parseInt(req.query.limit);

        if (!isNaN(limit) && limit > 0) {
            // Verificar si el límite es mayor que el total de productos
            if (limit > quantProducts) {
                return res
                    .status(400)
                    .json({
                        error: `El límite debe ser igual o menor a la cantidad de productos`,
                        cantidad_productos: `${quantProducts}`,
                    });
            }
            products = products.slice(0, limit);
            res.json({
                msg: `Estas viendo ${products.length} de ${quantProducts} productos`,
                products: products,
            });
        } else {
            res.json(products);
        }
    } catch (error) {
        res
            .status(500)
            .send({ status: 500, error: " No se pueden mostrar los productos" });
    }
};

export const getProductIdDataControllers = async (req, res) => {
    let { pid } = req.params;
    try {
        let idProduct = await productService.getProductById(pid);
        idProduct
            ? res.send({
                msg: `El Producto con el ID: ${pid} fue encontrado`,
                Product: idProduct,
            })
            : res.send({
                error: `El Producto con el ID: ${pid} no fue encontrado:(`,
            });
    } catch (error) {
        res
            .status(500)
            .send({
                status: 500,
                error: " Error al querer mostrar un producto por ID",
            });
    }
};

export const getProductWordDataControllers = async (req, res) => {
    let word = req.params.word;
    try {
        console.log("Busqueda Producto");
        let queryProduct = await productService.findByName(word);

        if (!queryProduct) {
            res.status(404).send({ message: "No se ha encontrado el Producto" });
            throw new Error("No se ha encontrado el Producto");
        } else {
            res.json(queryProduct);
        }
    } catch (error) {
        res
            .status(500)
            .send({
                status: 500,
                error: " Error al querer mostrar un producto por /:word",
            });
    }
};




export const postProductDataControllers = async (req, res) => {
    let newProduct = req.body;
    try {
        let newPost = await productService.addProduct(newProduct);
        newPost
            ? res.json(newPost)
            : res
                .status(404)
                .send({
                    error: `El Producto con el ID ${pid} no pudo agregarse correctamente`,
                });
    } catch (error) {
        res
            .status(500)
            .send({
                status: 500,
                error: `El codigo del producto ingresado ya existe.`,
                msg: " Error al querer agregar un producto",
            });
    }
};





export const putProductDataControllers = async (req, res) => {
    let { pid } = req.params;
    let productUpdate = req.body;

    try {
        let updated = await productService.updateProduct(pid, productUpdate);
        res.send({
            msg: `Producto con el ID ${pid} fue modificado`,
            product: updated,
        });
    } catch (error) {
        res
            .status(500)
            .send({ status: 500, error: " Error al querer editar un producto" });
    }
};




export const deleteProductDataControllers = async (req, res) => {
    let { pid } = req.params;

    try {
        let idProduct = await productService.deleteProduct(pid);
        console.log("ACKNOWLEDGED", idProduct);
        idProduct
            ? res.send({
                msg: `Producto con el ID ${pid} fue eliminado correctamente`,
            })
            : res.send({ msg: `Producto No encontrado` });
    } catch (error) {
        res
            .status(500)
            .send({ status: 500, error: " Error al eliminar un producto" });
    }
};

//?ROUTER.PARAM
// middleware para combrobar si las palabras que se pasan por url existen
//router.param(getProductWordDataControllers, async (req, res, next, title) => {
router.param("word", async (req, res, next, title) => {
    try {
        let result = await productService.findByName(title);

        if (!result) {
            req.product = null;
            throw new Error("No product found");
        } else {
            req.product = result;
        }
        next();
    } catch (error) {
        console.error("Ocurrió un error:", error.message);
        res.status(500).send({ error: "Error:", message: error.message });
    }
});