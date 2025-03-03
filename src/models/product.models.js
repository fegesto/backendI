import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,    
    code: {type: String, unique: true},
    price: Number,
    status: Boolean,
    stock: Number,
    thumbnail: String
});

productSchema.plugin(paginate);

productSchema.index({id: "text", title: "text", description: "text"});


const Product = mongoose.model("Product", productSchema);

export default Product;