import express from "express";
import ProductManager from "../productManager.js";

const viewsRouter = express.Router();

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render("realTimeProducts", {products, title:"Productos en tiempo real"});
});

export default viewsRouter;