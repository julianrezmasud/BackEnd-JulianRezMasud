import fs from 'fs'

class Product {

    constructor(title, description, price, thumbnail, code, stock, id) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = id;
    }

    static idCreator = 1;

};

export class ProductManager {

    #products;
    #productsDirPath;
    #productsFilePath;
    #fileSystem;

    constructor() {
        this.#products = new Array();
        this.#productsDirPath = './files';
        this.#productsFilePath = this.#productsDirPath + '/productos.json';
        //this.#fileSystem = require('fs');
        this.#fileSystem = fs
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return console.error(`Could not find product. Must complete all fields`);
        }

        let id = Product.idCreator++;
        let newProduct = new Product(title, description, price, thumbnail, code, stock, id);
        console.log(newProduct);

        try {

            await this.#fileSystem.promises.mkdir(this.#productsDirPath, { recursive: true });

            if (!this.#fileSystem.existsSync(this.#productsFilePath)) {

                await this.#fileSystem.promises.writeFile(this.#productsFilePath, '[]');
            }

            let productsFile = await this.#fileSystem.promises.readFile(this.#productsFilePath, 'utf-8')



            this.#products = JSON.parse(productsFile)

            const uniqueCode = this.#products.some(prod => prod.code === code);
            if (uniqueCode) {
                throw Error(`\n!!! Code ${code} - ${title} entered already exists`)

            } else {
                this.#products.push(newProduct)

            }


            await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));

        } catch (Error) {
            console.error(`Error adding new product: ${JSON.stringify(newProduct)}.\nError Detail: ${Error}`);
        }
    }

    getProducts = async () => {

        try {

            await this.#fileSystem.promises.mkdir(this.#productsDirPath, { recursive: true })
            if (!this.#fileSystem.existsSync(this.#productsFilePath)) {

                await this.#fileSystem.promises.writeFile(this.#productsFilePath, "[]");
                console.log('No products added')
            }


            let productsFile = await this.#fileSystem.promises.readFile(this.#productsFilePath, 'utf-8');
            this.#products = JSON.parse(productsFile)

            return this.#products;

        } catch (error) {
            console.error(`Error when consult product, validate file: ${JSON.stringify(this.#productsDirPath)}.\nError Detail: ${error}`);
            throw Error(`Error when consult product, validate file: ${JSON.stringify(this.#productsDirPath)}.\nError Detail: ${error}`);

        }
    }

    getProductById = async (id) => {

        try {

            await this.getProducts();
            console.info("Searching product by ID... ");

            const productId = await this.#products.find(prod => prod.id === id)
            productId
            console.log(`Product ID ${id} was found`)
            console.error(`Product ID ${id} not found`)
            return console.log(productId || "")

        } catch (error) {
            throw Error(`Error when searching product by ID: ${JSON.stringify(this.#productsDirPath)}.\nError Detail: ${error}`);
        }
    }

    updateProduct = async ({ id, ...updprod }) => {

        try {

            await this.deleteProduct(id)

            await this.getProducts();

            let prodsUpdated = [
                { ...updprod, id }, ...this.#products
            ];

            console.log(`Updated product ID ${id}`)
            console.log(prodsUpdated)

            await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(prodsUpdated, null, 2, '\t'));

        } catch (error) {
            throw Error(`Error when modify product: ${JSON.stringify(this.#productsDirPath)}.\nError detail: ${error}`);
        }

    }

    deleteProduct = async (id) => {

        try {

            await this.getProducts();

            const productIndex = this.#products.findIndex(prod => prod.id === id);
            if (productIndex !== -1) {

                const filterProductbyId = this.#products.filter(prod => prod.id !== id);
                console.info("Searching product by ID to eliminate");
                console.log(`Product with ID deleted: ${id}`);

                await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(filterProductbyId, null, 2, '\t'));
            } else {
                console.log(`Product with ID ${id} not exist`);
            }

        } catch (error) {
            throw Error(`Error when deleted product: ${JSON.stringify(this.#productsDirPath)}.\nError detail: ${error}`);
        }
    }

}

//module.exports = ProductManager;
//export { ProductManager }













