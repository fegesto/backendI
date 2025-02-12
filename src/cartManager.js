import fs from "fs";
import ProductManager from "./productManager.js";

class CartManager {

    static carts = [];
    static path = "./src/cart.json";
    constructor (path) {
        this.path = path;
    }

    //Inicializo
    static initialize = async() => {
        try{
            const fileData = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(fileData);
        } catch(er) {
            console.error(er);
        }
    };

    //Crear carrito
    static createCart = async (carts) => {
        try{
            const id = this.carts.length + 1; //Id autoincrementable
            const products = [];
            const newCart = {id, products, ...carts};

            this.carts.push(newCart);
            await this.saveCarts();
            return newCart;
        } catch(er) {
            console.error(er);
        }
    }

    //Guardar carrito
    static saveCarts = async () => {
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
        } catch(er) {
            console.error(er);
        }
    }

    //Buscar productos de carrito por ID
    static getCartById = (id) =>{
        try{
        const cart = this.carts.find(cart => cart.id == Number(id));
        if (!cart) {
            return console.log("Not found");
        }
        return cart.products;
    } catch(er) {
        console.error(er);
    }}

    //Agrego productos al carrito
    static updateCartProduct = async (cartId, productId) => {
        try {
            await ProductManager.initialize();
            const product = ProductManager.products.find(product => product.code == productId);

            if (!product) {
                console.log("Producto no encontrado");
                return;
            }

            const cartIndex = CartManager.carts.findIndex(cart => cart.id == Number(cartId));
            if (cartIndex == -1) {
                console.log("Carrito no encontrado");
                return;
            }

            const cart = CartManager.carts[cartIndex];

            const productIndex = cart.products.findIndex(product => product.product == productId);
            if (productIndex == -1) {
                cart.products.push({product: productId, quantity: 1});
            } else {
                cart.products[productIndex].quantity++;
            }

            await CartManager.saveCarts();
            return cart;        
        
        } catch (er) {
            console.error("Error al actualizar carrito:", er);
        }
    }
}

const cartManager = new CartManager("cart.json");
export default CartManager;