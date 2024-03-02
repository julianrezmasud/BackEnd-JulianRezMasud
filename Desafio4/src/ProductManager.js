import fs from 'fs'

export class Product {

    constructor(title, description, code, price, status, stock, category, thumbnail) {

        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnail = thumbnail;

    }
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

        this.#fileSystem = fs
    }

    randomIdGenerator = async () => {
        let code = "";

        for (let i = 0; i < 3; i++) {
            code += Math.floor(Math.random() * 10);
        }

        const randomLetter = String.fromCharCode(
            Math.floor(Math.random() * (90 - 65 + 1)) + 65
        );
        code += randomLetter;
        return code;
    };


    createDirOrFile = async () => {
        await this.#fileSystem.promises.mkdir(this.#productsDirPath, {
            recursive: true,
        });
        if (!this.#fileSystem.existsSync(this.#productsFilePath)) {
            await this.#fileSystem.promises.writeFile(this.#productsFilePath, "[]");
        }
    }


    getProducts = async () => {
        try {
            await this.createDirOrFile()

            let productsFile = await this.#fileSystem.promises.readFile(this.#productsFilePath, 'utf-8')
            this.#products = JSON.parse(productsFile)
            return this.#products

        } catch (error) {
            throw Error(`Error consulting products: ${JSON.stringify(this.#productsDirPath)}.\nError Detail: ${error}`);
        }
    }


    getProductById = async (id) => {

        try {
            let productsExist = await this.getProducts()

            if (productsExist.length === 0) { return "Product doesn't exist" }
            else {

                let productId = await this.#products.find(prod => prod.id === id)
                if (!productId) { return "Product not found" }
                return productId
            }

        } catch (error) {
            throw Error(`Error tryign to find product by ID: ${JSON.stringify(this.#productsDirPath)}.\nDetalle del error: ${error}`);
        }
    }



    addProduct = async ({ title, description, code, price, status, stock, category, thumbnail }) => {


        if (!title || !description || !code || !price || !status || !stock || !category) {
            return "Must be Completed";
        }

        let newProduct = new Product(title, description, code, price, status, stock, category, thumbnail);

        let idProd = await this.randomIdGenerator()
        newProduct.id = idProd

        try {
            await this.getProducts()

            const uniqueCode = this.#products.some(prod => prod.code === code);
            if (uniqueCode) {
                return `The Code${code}  ${title} already exist`
            } else {
                this.#products.push(newProduct)
            }

            await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
            return newProduct


        } catch (Error) {
            console.error(`Error tryign to add new product: ${Error}`);
        }
    }


    updateProduct = async ({ id, ...updprod }) => {

        try {

            await this.deleteProduct(id)

            await this.getProducts();

            let prodsUpdated = [
                { ...updprod, id: id }, ...this.#products
            ];


            await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(prodsUpdated, null, 2, '\t'));

            return prodsUpdated

        } catch (error) {
            throw Error(`Error trying to modify product: ${JSON.stringify(this.#productsDirPath)}.\nError Detail: ${error}`);
        }

    }

    deleteProduct = async (id) => {

        try {

            await this.getProducts();
            const productsSize = this.#products.length;


            const productPosition = this.#products.findIndex((prod => prod.id === id));
            if (productPosition < 0) {
                return console.log('product not found');
            }

            this.#products.splice(productPosition, 1);
            if (this.#products.length === productsSize) {
                return console.log('Cant eliminate product')
            }

            await this.#fileSystem.promises.writeFile(this.#productsFilePath, JSON.stringify(this.#products, null, 2, '\t'));
            return this.#products

        } catch (error) {
            throw Error(`Error trying to eliminate a product: ${JSON.stringify(this.#productsDirPath)}.\nError Detail: ${error}`);
        }
    }




}



