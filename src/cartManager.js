import mongoose from "mongoose";
import Cart from "./models/cart.model.js";
import Product from "./models/product.models.js";
import ProductManager from "./productManager.js";


class CartManager {

    //Crear carrito
    static async createCart () {
        try{
            const newCart = await Cart.create({products: []});
            return newCart;
        } catch(er) {
            console.error(er);
        }
    }

    //Buscar carrito por ID
    static async getCartById (id) {
        try{
        const cart = await Cart.findById(id).populate("products.product").lean();
        if (!cart) {
            return console.log("Carrito no encontrado");
        }
        return cart;
    } catch(er) {
        console.error(er);
    }}

    //Agrego productos al carrito
    static async updateCartProduct (cid, pid) {
        try {

            const product = await Product.findById(pid);
            if (!product) {
                return console.log("Producto no encontrado");
            }

            const cart = await Cart.findById(cid);
            if (!cart) {
                return console.log("Carrito no encontrado");
            }

            const productIndex = cart.products.findIndex(product => product.product == pid);
            if (productIndex == -1) {
                cart.products.push({product: pid, quantity: 1});
            } else {
                cart.products[productIndex].quantity++;
            }

            await cart.save();
            return cart;    
        
        } catch (er) {
            console.error("Error al actualizar carrito:", er);
        }
    }

    //Eliminar productos del carrito por ID
    static async deleteCartProduct (cartId, productId) {
        try {

            const product = await Product.findById(productId);
            if (!product) {
                return console.log("Producto no encontrado");
                return null;
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                return console.log("Carrito no encontrado");
                return null;
            }

            const productIndex = cart.products.findIndex(product => product.product == productId);
            
            if (productIndex === -1) {
                console.log("El producto no está en el carrito");
                return null;
            }
            cart.products.splice(productIndex, 1);

            await cart.save();
            return cart;    
        
        } catch (er) {
            console.error("Error al actualizar carrito:", er);
        }
    }

    //Actualizar carrito
    static async updateCart(cartId, products) {
        try {

            const cart = await Cart.findByIdAndUpdate(
                cartId, 
                {products: products}, 
                {new: true}
            ).populate("products.product");
            
            return cart;

        } catch (er) {
            console.error(er);
        }
    }

    //Actualizar cantidad de productos en carrito
    static async updateCartProductQuantity (cartId, pid, quantity) {
        try{
            const cart = await Cart.findById(cartId);
            if (!cart) return console.log("Carrito no encontrado");

            const productIndex = cart.products.findIndex(product => product.product == pid);
            if (productIndex == -1) return console.log("Producto no encontrado");

            cart.products[productIndex].quantity = quantity;

            await cart.save();
            return cart;
        }catch(er){
            console.error(er);
        }
    }

    //Vaciar carrito
    static async deleteCart (cartId) {
        try {

            const cart = await Cart.findByIdAndUpdate(
                cartId,
                {products: []},
                {new: true}
            );
            return cart;    
        
        } catch (er) {
            console.error("Error al vaciar el carrito:", er);
        }
    }
}

export default CartManager;