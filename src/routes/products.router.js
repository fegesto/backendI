import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.models.js";
import ProductManager from "../productManager.js";


const productsRouter = express.Router();

productsRouter.get("/products", async (req, res) => {
    try{
        const {limit = 10, page = 1, sort, query} = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? {price: 1} : sort === 'desc' ? {price: -1} : undefined,
        };

        const filter = query ? {$text: {$search: query}} : {};

        const products = await Product.paginate(filter, options);
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
        res.status(200).send(response);

        } catch(err){
        res.status(500).send({status: "error", error: err.message});
    }
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
