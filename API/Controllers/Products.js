import mongoose from "mongoose";

const productSchema = new mongoose.Schema ({
    name : String,
    upc : String,
    available_on : Date,
    properties : [{
        name: String,
        value: String,
    }]
});
const Product = mongoose.model("Product", productSchema);

export const getProducts = async (req, res, next) => {
    const products = await Product.find({});
    res.send(products);
}

export const addProduct = async (req, res, next) => {
    const validation = await validateProduct(req.body);
    if (validation.success === false) {
        res.statusCode = 400;
        res.send(validation);
    }
    else {
        let newProduct = new Product({
            name: req.body.name,
            upc: req.body.upc,
            available_on: req.body.available_on,
            properties: []
        });
    
        req.body.properties.forEach(property => {
            newProduct.properties.push({
                name: property.name,
                value: property.value
            })
        });
    
        newProduct.save((error, data) => {
            if (error) {
                next(error);
            }
            else {
                res.send({success: true});
            }
        });
    }
}

const productNameExists = async (productName) => {
    const products = await Product.where("name").equals(productName);
    return products.length > 0;
}

const productUpcExists = async (productUpc) => {
    const products = await Product.where("upc").equals(productUpc);
    return products.length > 0;
}

const isNumeric = (value) => {
    return /^\d+$/.test(value);
}

const tryParseDate = (value) => {
    var parsedDate = Date.parse(value);

    if (isNaN(parsedDate))
        return null;

    return new Date(parsedDate);
}

const getUniqueValues = (arr, prop) => {
    return [...new Set(arr.map(item => item[prop]))];
}

const validateProduct = async (product) => {
    if (!product || Object.keys(product).length === 0) return { success: false, message: "Request body was empty" };
    if (!product.hasOwnProperty("name") || product.name === "") return { success: false, message: "Property name was not provided" };
    if (!product.hasOwnProperty("upc") || product.upc === "") return { success: false, message: "Property upc was not provided" };
    if (!product.hasOwnProperty("available_on") || product.available_on === "") return { success: false, message: "Property available_on was not provided" };
    if (!product.hasOwnProperty("properties") || product.name === "") return { success: false, message: "Property properties was not provided" };

    // Validate name
    if (typeof product.name !== "string") return { success: false, message: "Product name was not a string" };
    if (product.name.length > 1024) return { success: false, message: "Product name was too long" };
    if (await productNameExists(product.name)) return { success: false, message: "Product name was not unique" };

    // Validate upc
    if (typeof product.upc !== "string") return { success: false, message: "Product upc was not a string" };
    if (product.upc.length !== 10 && product.upc.length !== 12 && product.upc.length !== 13) return { success: false, message: "Product upc was not a valid length" };
    if (await productUpcExists(product.upc)) return { success: false, message: "Product upc was not unique" };
    if (!isNumeric(product.upc)) return { success: false, message: "Product upc was not numeric" };

    // Validate available_on
    if (typeof product.available_on !== "string") return { success: false, message: "Product available_on was not a string" };
    const availableOnDate = tryParseDate(product.available_on);
    if (availableOnDate == null) return { success: false, message: "Product available_on was not a valid Date" };
    if (availableOnDate <= Date.now()) return { success: false, message: "Product available_on was not in the future" };

    // Validate properties
    if (!Array.isArray(product.properties)) return { success: false, message: "Product properties was not an array" };
    if (getUniqueValues(product.properties, "name").length !== product.properties.length) return { success: false, message: "Property name was not unique" };
    for (let i = 0; i < product.properties.length; i++) {
        let property = product.properties[i];
        // Validate property name
        if (typeof property.name !== "string") return { success: false, message: "Property name was not a string" };
        if (property.name.length > 255 ) return { success: false, message: "Property name was not a valid length" };

        // Validate property value
        if (typeof property.value !== "string") return { success: false, message: "Property value was not a string" };
        if (property.value.length > 255 ) return { success: false, message: "Property value was not a valid length" };
    }

    return { success: true };
}