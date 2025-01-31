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
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const cart = await CartManager.updateCartProduct(idCart, idProduct);
    if (!cart) return res.status(404).send({message: `${idCart} no encontrado`});
    res.status(200).send(cart);
});

export default cartsRouter;