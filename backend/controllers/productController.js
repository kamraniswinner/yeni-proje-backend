// controllers/productController.js

import Products from '../models/Products.js';

// Get all products
export async function getAllProducts(req, res) {
  try {
    const product = await Products.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Get a product by productNumber
export async function getProductByProductNumber(req, res) {
  try {
    const { productNumber } = req.params;
    console.log(`Fetching product with productNumber: ${productNumber}`); // Debugging line

    const product = await Products.findOne({ productNumber });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Create a new product
export async function createProduct(req, res) {
  try {
    const { productId, productNumber, name, description, price, images, gender, category, stock } = req.body;
    const imagesArray = Array.isArray(images) ? images : [images];

    const newProduct = new Products({
      productId,
      productNumber,
      name,
      description,
      price,
      images: imagesArray,
      gender,
      category,
      stock,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating product:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
}

// Update an existing product by productNumber
export async function updateProduct(req, res) {
  try {
    const { productNumber } = req.params;
    const { name, description, price, images, gender, category, stock } = req.body;

    console.log(`Updating product with productNumber: ${productNumber}`); // Debugging line

    const updatedProduct = await Products.findOneAndUpdate(
      { productNumber },
      {
        name,
        description,
        price,
        images,
        gender,
        category,
        stock,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

// Delete a product by productNumber
export async function deleteProduct(req, res) {
  try {
    const { productNumber } = req.params;

    console.log(`Deleting product with productNumber: ${productNumber}`); // Debugging line

    const deletedProduct = await Products.findOneAndDelete({ productNumber });
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
