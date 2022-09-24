import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema ({

    name : String,
    upc : String,
    available_on : Date,
    properties : [{
        name: String,
        value: String,
    }]

});

export const Product = mongoose.model("Product", ProductSchema)

