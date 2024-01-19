class ProductManager {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.products = []
    }
    addProduct(product) {
        this.products.push(product)

    }
    /*
        getProducts(product) {
            this.products.push(product)
    
        }
    
    
        getProductById(product) {
            this.products.push(product)
    
        }
    */

}

const camera1 = new ProductManager("BMPCC4k", "Perfect Camera for Amateur Filmmakers", "$1295", "Thumbnail", "Code", "10")
const camera2 = new ProductManager("BMPCC6K PRO", "Perfect Camera for Professional Filmmakers", "$2599", "Thumbnail", "Code", "10")
const camera3 = new ProductManager("EOS C200", "Perfect Camera for Professional Filmmakers", "$3499", "Thumbnail", "Code", "8")
const camera4 = new ProductManager("EOS R5 C MIRRORLESS", "Perfect Camera for Professional Filmmakers", "$3999", "Thumbnail", "Code", "8")
const camera5 = new ProductManager("FX30 SUPER 35 CINEMA LINE", "Perfect Camera for Amateur Filmmakers", "$1799", "Thumbnail", "Code", "5")
const camera6 = new ProductManager("FX6 FULL-FRAME", "Perfect Camera for Professional Filmmakers", "$5999", "Thumbnail", "Code", "5")


console.log(camera1);
console.log(camera2);

//console.log(camera.video());
//console.log(camera.resolution());
// console.log(camera2.resolution());
