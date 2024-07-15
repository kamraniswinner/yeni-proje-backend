import Inventory from '../models/Inventory.js';
import { uploadToS3 } from '../config/awsConfig.js';
import dotenv from 'dotenv';
dotenv.config();


// Create a new inventory item
export const createInventory = async (req, res) => {
  try {
    const { productNumber, productName, stock, batchNo, batchIncomingDate } = req.body;
    const images = req.files;

    const imageUploadPromises = images.map((image) => uploadToS3(image, process.env.S3_BUCKET_NAME));
    console.log('Bucket Name...:', process.env.S3_BUCKET_NAME);
    const uploadedImages = await Promise.all(imageUploadPromises);

    const imageUrls = uploadedImages.map(upload => upload.Location);

    const newInventory = new Inventory({
      productNumber,
      productName,
      images: imageUrls,
      stock,
      batchNo,
      batchIncomingDate,
    });

    const savedInventory = await newInventory.save();

    res.status(201).json(savedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing inventory item
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { productNumber, productName, stock, batchNo, batchIncomingDate } = req.body;
    const files = req.files;

    let imageMetadata = [];
    if (files && files.length > 0) {
      imageMetadata = await Promise.all(
        files.map((file) => uploadToS3(file, id, process.env.S3_BUCKET_NAME))
      );
    }

    const updatedData = {
      productNumber,
      productName,
      stock,
      batchNo,
      batchIncomingDate,
      ...(imageMetadata.length > 0 && { images: imageMetadata.map(img => img.Location) }),
    };

    const updatedInventory = await Inventory.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an inventory item
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryItem = await Inventory.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Delete images from S3
    const deleteImagePromises = inventoryItem.images.map((url) => {
      const key = url.split('/').slice(-1)[0];
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${id}/${key}`,
      };
      return s3.deleteObject(params).promise();
    });
    await Promise.all(deleteImagePromises);

    await Inventory.findByIdAndDelete(id);

    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all inventory items
export const getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.status(200).json(inventoryItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single inventory item by id
export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await Inventory.findById(id);

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInventoryByProductNumber = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productNumber: req.params.productNumber });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory by product number:', error);
    res.status(500).json({ message: 'Server error' });
  }
};