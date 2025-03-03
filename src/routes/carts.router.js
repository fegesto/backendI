import express from "express";
import CartManager from "../cartManager.js";

const cartsRouter = express.Router();

cartsRouter.post("/carts", async (req, res) => {
    const cart = req.body;
    const newCart = await CartManager.createCart(cart);
    res.status(201).send(newCart);
});

cartsRouter.get("/carts/:cid", async (req, res) => {
    const id = req.params.cid;
    const cart = await CartManager.getCartById(id);
    if (!cart) return res.status(404).send({message: `${id} no encontrado`});
    res.status(200).send(cart);
});

cartsRouter.post("/carts/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await CartManager.updateCartProduct(cartId, productId);
    if (!cart) return res.status(404).send({message: `${cartId} no encontrado`});
    res.status(200).send(cart);
});

cartsRouter.delete("/carts/:cid/products/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const cart = await CartManager.deleteCartProduct(idCart, idProduct);
    if (!cart) return res.status(404).send({message: `${idCart} no encontrado`});
    res.status(200).send(cart);
});

cartsRouter.put("/carts/:cid", async (req, res) => {
    const {cid} = req.params;
    const {products} = req.body;

    const updateCart = await CartManager.updateCart(cid, products);
    if (!updateCart) return res.status(404).send({message: `${cid} no encontrado`});
    res.status(200).send(updateCart);
});

cartsRouter.put("/carts/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    const updateCart = await CartManager.updateCartProductQuantity(cid, pid, quantity);
    if (!updateCart) return res.status(404).send({message: `${cid} no encontrado`});
    res.status(200).send(updateCart);
});

cartsRouter.delete("/carts/:cid", async (req, res) => {
    const {cid} = req.params;

    const deletedCart = await CartManager.deleteCart(cid);
    if (!deletedCart) return res.status(404).send({message: `${cid} no encontrado`});
    res.status(200).send(deletedCart);
});

export default cartsRouter;