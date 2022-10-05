import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { addProduct, getProducts } from './Controllers/Products.js';
 
const app = express();
app.use(bodyParser.json());

// Products
app.get("/products", getProducts);
app.post("/products/add", addProduct);

try {
  await mongoose.connect('mongodb://127.0.0.1:27017/product_database');

  app.listen(3001, () =>
    console.log('Example app listening on port 3001!'),
  );
} 
catch(error) {
  console.error(error);
  process.exit(1);
}

