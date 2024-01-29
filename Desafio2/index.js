
const ProductManager = require('./ProductManager.js')

let productManager = new ProductManager()
console.log(productManager);

let allProducts = async () => {

    await productManager.addProduct("BMPCC4k", "Perfect Camera for Amateur Filmmakers", "$1295", "Thumbnail", "C001", "10")
    await productManager.addProduct("BMPCC6K PRO", "Perfect Camera for Professional Filmmakers", "$2599", "Thumbnail", "C002", "10");
    await productManager.addProduct("EOS C200", "Perfect Camera for Professional Filmmakers", "$3499", "Thumbnail", "C003", "8");
    await productManager.addProduct("EOS R5 C MIRRORLESS", "Perfect Camera for Professional Filmmakers", "$3999", "Thumbnail", "C004", "8");
    await productManager.addProduct("FX30 SUPER 35 CINEMA LINE", "Perfect Camera for Amateur Filmmakers", "$1799", "Thumbnail", "C005", "5");
    await productManager.addProduct("FX6 FULL-FRAME", "Perfect Camera for Professional Filmmakers", "$5999", "Thumbnail", "C006", "5");

    let products = await productManager.getProducts()
    console.log(`Products found in Product Manager: ${products.length}`);
    console.log(products);

    await productManager.getProductById(5)
    await productManager.getProductById(5)

    await productManager.updateProduct(
        {
            "title": "FX6 FULL-FRAME",
            "description": "Perfect Camera for Professional Filmmakers",
            "price": 5999,
            "thumbnail": "Image",
            "code": "C006",
            "stock": 5,
            "id": 2
        }
    );

    await productManager.deleteProduct(1)

}

allProducts()