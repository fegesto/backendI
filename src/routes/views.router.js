import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.models.js";
import ProductManager from "../productManager.js";
import Cart from "../models/cart.model.js";
import CartManager from "../cartManager.js";

const viewsRouter = express.Router();

viewsRouter.get("/products", async (req, res) => {
    try{

        const {limit = 10, page = 1, sort, query} = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? {price: 1} : sort === 'desc' ? {price: -1} : undefined,
        };

        const filter = query ? {$text: {$search: query}} : {};

        const products = await Product.paginate({},{filter, options, lean: true});
        const response = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        }
        console.log(products);
        res.render("home", {response, title:"Productos"});

        } catch(err){
        res.status(500).send({status: "error", error: err.message});
    }
});

viewsRouter.post("/carts/:cid/products/:pid", async (req, res) => {
    
    let cartId = req.params.cid;
    const productId = req.params.pid;

    let cart = await Cart.findById(cartId);
    
    if (!cart) {
        cart = await CartManager.createCart();
        if (!cart) return res.status(500).send({message: "Error al crear el carrito"});
        cartId = cart._id;
    }

    const cartUpdated = await CartManager.updateCartProduct(cartId, productId);
    res.status(200).send(cart);
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    const id = req.params.cid;
    const cart = await CartManager.getCartById(id);
    if (!cart) return res.status(404).send({message: `${id} no encontrado`});
    res.render("cartId", {cart});
});


export default viewsRouter;