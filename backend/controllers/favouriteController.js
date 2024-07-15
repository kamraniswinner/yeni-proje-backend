import Favourite from '../models/Favourite.js';

// Get all favourite products for a user
export const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.findOne({ user: req.params.userId }).populate('products');
    if (!favourites) {
      return res.status(404).json({ message: 'No favourites found' });
    }
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a product to favourites
export const addFavourite = async (req, res) => {
  const { prodId } = req.body;
  try {
    let favourites = await Favourite.findOne({ user: req.params.userId });
    if (!favourites) {
      favourites = new Favourite({ user: req.params.userId, products: [prodId] });
    } else {
      favourites.products.push(prodId);
    }
    await favourites.save();
    res.status(201).json(favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from favourites
export const removeFavourite = async (req, res) => {
  const { prodId  } = req.body;
  try {
    const favourites = await Favourite.findOne({ user: req.params.userId });
    if (!favourites) {
      return res.status(404).json({ message: 'No favourites found' });
    }
    favourites.products = favourites.products.filter(id => id.toString() !== prodId);
    await favourites.save();
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
