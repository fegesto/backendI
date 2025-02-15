import express from "express";
import {engine} from "express-handlebars";
import http from "http";
import {Server} from "socket.io";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

app.set("io", io);

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api", productsRouter);
app.use("/", viewsRouter);


io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado",socket.id);
});

io.on("productAdded", async () => {
    console.log("recibiendo evento productAdded");
    const products = await ProductManager.getProducts();
    console.log("Productos actualizados:", products);
    io.emit("updateProducts", products); 
    console.log("Productos enviados al cliente");
});

//Products
ProductManager.initialize().then(() => {
    
    app.use("/api", productsRouter);
});
//Cart

CartManager.initialize().then(() => {
    
    app.use("/api", cartsRouter);
    
});


//Llamo al servidor
server.listen(PORT, () => {
    console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});