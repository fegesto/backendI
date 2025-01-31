import express from "express";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
app.use(express.json()); // Habilita el editado del JSON
app.use(express.urlencoded({extended: true})); //enviar información por un formulario

//Products
ProductManager.initialize().then(() => {
    
    app.use("/api", productsRouter);
});
    //Cart

    CartManager.initialize().then(() => {

    app.use("/api", cartsRouter);

});

//Llamo al servidor
app.listen(8080, () => {
    console.log("Servidor iniciado en: http://localhost:8080")
});