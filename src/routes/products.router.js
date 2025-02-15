import express from "express";
import ProductManager from "../productManager.js";


const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render("home", {products, title:"Productos"});
});

productsRouter.get("/products", async (req, res) => {
    const products = await ProductManager.getProducts();
    res.status(200).send(products);
});

productsRouter.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const product = await ProductManager.getProductById(id);
    if (!product) return res.status(404).send({message: `${id} no encontrado`});
    res.status(200).send(product);
});

productsRouter.post("/products", async (req, res) => {
    const product = req.body;
    const newProduct = await ProductManager.addProduct(product);
    if (!newProduct) return res.status(400).send({message: `El producto ${product.code} ya existe`});
    res.status(201).send(newProduct);
});

productsRouter.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const {title, description, code, price, status,thumbnail, stock} = req.body;
    const updatedProduct = await ProductManager.updateProduct(id, {title, description, code, price, status,thumbnail, stock});
    if (!updatedProduct) return res.status(404).send({message: `${id} no encontrado`});
    res.status(200).send(updatedProduct);
});

productsRouter.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const deletedProduct = await ProductManager.deleteProduct(id);
    if (!deletedProduct) return res.status(404).send({message: `${id} no encontrado`});
    res.status(200).send(deletedProduct);
});

productsRouter.post("/api/products", async (req, res) => {
    const product = req.body;
    const newProduct = await ProductManager.addProduct(product);
    if (!newProduct) return res.status(400).send({message: `El producto ${product.code} ya existe`});

    req.app.get("io").emit("productAdded");
    res.status(201).send(newProduct);
});


export default productsRouter;
