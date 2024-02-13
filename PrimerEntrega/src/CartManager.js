import fs from "fs";
import { ProductManager } from "./ProductManager.js";
let allProductsManager = new ProductManager()


export class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}

export class CartManager {
    #cart;
    #cartDirPath;
    #cartFilePath;
    #fileSystem;

    constructor() {
        this.#cart = new Array();
        this.#cartDirPath = "./src/files";
        this.#cartFilePath = this.#cartDirPath + "/carts.json";
        this.#fileSystem = fs;
    }

    randomIdCartGenerator = async () => {
        let code = "";
        for (let i = 0; i < 9; i++) {
            code += Math.floor(Math.random() * 10);
        }

        const randomLetter = String.fromCharCode(
            Math.floor(Math.random() * (90 - 65 + 1)) + 65
        );
        return randomLetter + '-' + code;
    };

    createDirOrFile = async () => {
        await this.#fileSystem.promises.mkdir(this.#cartDirPath, {
            recursive: true,
        });
        if (!this.#fileSystem.existsSync(this.#cartFilePath)) {
            await this.#fileSystem.promises.writeFile(this.#cartFilePath, "[]");
        }
    };

    getCarts = async () => {
        try {
            await this.createDirOrFile();

            let cartFile = await this.#fileSystem.promises.readFile(
                this.#cartFilePath,
                "utf-8"
            );
            this.#cart = JSON.parse(cartFile);

            if (this.#cart.length === 0) { return "Cart not available at the moment" }
            else {
                return this.#cart;
            }

        } catch (error) {
            throw Error(
                `Error trying to check Cart: ${JSON.stringify(
                    this.#cartDirPath
                )}.\nDetail Error: ${error}`
            );
        }
    };

    getCartById = async (id) => {
        try {
            await this.getCarts();

            if (this.#cart.length === 0) return "None Cart added at the moment."

            let cartId = await this.#cart.find(cart => cart.id === id);
            return cartId

        } catch (error) {
            throw Error(
                `Error trying to find cart by ID: ${JSON.stringify(
                    this.#cartDirPath
                )}.\nDetail Error: ${error}`
            );
        }
    };

    addCart = async () => {
        try {
            let idCart = await this.randomIdCartGenerator();
            let newCart = new Cart(idCart, []);
            console.log("New Cart");
            console.log(newCart);

            await this.createDirOrFile();
            await this.getCarts();

            this.#cart.push(newCart);

            await this.#fileSystem.promises.writeFile(
                this.#cartFilePath,
                JSON.stringify(this.#cart, null, 2, "\t")
            );

            return this.#cart;
        } catch (error) {
            console.error(`Error adding new Cart: ${error}`);
            throw error;
        }
    };


    addNewProductsInCart = async (cid, pid) => {


        let cartById = await this.getCartById(cid)
        if (!cartById) return `Cart ${cid} not available`

        let productById = await allProductsManager.getProductById(pid)
        if (!productById) return `Product ${pid} not found`


        let productExist = cartById.products.find(prod => prod.id === pid);
        productExist
            ? productExist.quantity++
            : cartById.products.push({ id: productById.id, quantity: 1 });


        let allCarts = await this.getCarts();

        allCarts = allCarts.filter(cart => cart.id !== cid);
        let updatedCarts = [cartById, ...allCarts];

        await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(updatedCarts, null, 2, "\t"));

        return updatedCarts;
    }

}
