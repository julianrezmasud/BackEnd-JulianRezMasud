class ProductManager {
    constructor() {
        this.products = []
        this.idCreator = 1
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error(`${title}`);
            return;
        }

        const thisCode = this.products.some(prod => prod.code === code);
        if (thisCode) {
            console.error(`The Code ${code} and ${title} already exist`)
            return;
        }

        let id = this.idCreator++

        const newProduct = { title, description, price, thumbnail, code, stock, id };
        this.products.push(newProduct)
    }

    getProducts() {
        return console.log(this.products)
    }

    getProductById(id) {
        const productId = this.products.find(prod => prod.id === id)

        productId
        console.log(`Product ID ${id} was found`)
        console.error(`Product ID Not Found`)
    }
}

const productManager = new ProductManager();

productManager.addProduct("BMPCC4k", "Perfect Camera for Amateur Filmmakers", "$1295", "Thumbnail", "C001", "10");
productManager.addProduct("BMPCC6K PRO", "Perfect Camera for Professional Filmmakers", "$2599", "Thumbnail", "C002", "10");
productManager.addProduct("EOS C200", "Perfect Camera for Professional Filmmakers", "$3499", "Thumbnail", "C003", "8");
productManager.addProduct("EOS R5 C MIRRORLESS", "Perfect Camera for Professional Filmmakers", "$3999", "Thumbnail", "C004", "8");
productManager.addProduct("FX30 SUPER 35 CINEMA LINE", "Perfect Camera for Amateur Filmmakers", "$1799", "Thumbnail", "C005", "5");
productManager.addProduct("FX6 FULL-FRAME", "Perfect Camera for Professional Filmmakers", "$5999", "Thumbnail", "C006", "5");


productManager.getProducts()

productManager.getProductById(1)