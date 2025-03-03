import Product from "./models/product.models.js";

class ProductManager {

    //Agregar productos
    static async addProduct (product) {
        try{
            const {code} = product;
            const existingProduct = await Product.findOne({code});
            if(existingProduct) return console.log("El producto ya existe");

            const newProduct = await Product.create(product);
            
            return newProduct;
        } catch(er) {
            console.error(er);
        }
    };

    //Obtener productos
    static async getProducts() {
        try {
            return await Product.find();
        } catch(er) {
            console.error(er);
        }
    };

    //Obtener producto por ID
    static async getProductById (id) {
        try{
        const product = await Product.findById(id);
        if (!product) {
            return console.log("Not found");
        }
        return product;
    } catch(er) {
        console.error(er);
    }};

    //Actualizar producto
    static async updateProduct (id, updateProduct) {
        try{
        const updatedProduct = await Product.findByIdAndUpdate(id, updateProduct, {new: true});
        if (!updatedProduct) {
            return console.log("Producto no encontrado");
        }
            return updatedProduct;
        }catch(er) {
            console.error(er);
        }
    };

    //Eliminar producto
    static async deleteProduct (id) {
        try{
            const deleteProduct = await Product.findByIdAndDelete(id);
            if (!deleteProduct) {
                return console.log("Producto no encontrado");
            }
            return deleteProduct;
        }catch(er) {
            console.error(er);
        }
    }
}

export default ProductManager;