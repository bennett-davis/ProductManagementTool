import express from 'express';
import mongoose from 'mongoose';
import {Product} from './Schemas/ProductSchema.js'

const app = express();

try {
  await mongoose.connect('mongodb://127.0.0.1:27017/product_database');

  app.listen(3001, () =>
    console.log('Example app listening on port 3000!'),
  );
} 
catch(error) {
  console.error(error);
  process.exit(1);
}

