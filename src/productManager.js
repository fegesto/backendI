import fs from "fs";

class ProductManager {

    static products = [];
    static path = "./products.json";
    constructor (path) {
        this.path = path;
    }

    static initialize = async() => {
        try{
            const fileData = await fs.promises.readFile(this.path, "utf-8");
            this.products = JSON.parse(fileData);
        } catch(er) {
            console.error(er);
        }
    };

    static addProduct = async (product) => {
        try{
            const {code} = product;
            const existingProduct = this.products.find(product => product.code == code);
            if(existingProduct) return console.log("El producto ya existe");

            const id = this.products.length + 1; //Id autoincrementable
            const newProduct = {id, ...product};

            this.products.push(newProduct);
            await this.saveProducts();
            return newProduct;
        } catch(er) {
            console.error(er);
        }
    }

    static saveProducts = async () => {
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
        } catch(er) {
            console.error(er);
        }
    }

    static getProducts = async () => {
        try {
            return this.products;
        } catch(er) {
            console.error(er);
        }
    }

    static getProductById = (id) =>{
        try{
        const product = this.products.find(product => product.id == Number(id));
        if (!product) {
            return console.log("Not found");
        }
        return product;
    } catch(er) {
        console.error(er);
    }}

    static updateProduct = async (id, updateProduct) => {
        try{
            const productId = Number(id);

            const productIndex = this.products.findIndex(product => product.id === productId);
            if (productIndex == -1) {
                console.log("Producto no encontrado");
                return null;
            }

            const updatedProduct = {...this.products[productIndex], ...updateProduct};
            this.products[productIndex] = updatedProduct;
            
            await this.saveProducts();
            return updatedProduct;
        }catch(er) {
            console.error(er);
        }
    }

    static deleteProduct = async (id) => {
        try{

            const productId = Number(id);
            const productIndex = this.products.findIndex(product => product.id === productId);
            if (productIndex == -1) {
                console.log("Producto no encontrado");
                return;
            }
            const deletedProduct = this.products.splice(productIndex, 1);
            await this.saveProducts();
            return deletedProduct[0]
        }catch(er) {
            console.error(er);
        }
    }
}

const productManager = new ProductManager("products.json");
export default ProductManager;