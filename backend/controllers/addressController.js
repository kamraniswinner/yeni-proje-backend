import Address from '../models/Address.js';
import User from '../models/User.js';

// Create a new address for a userr
export const createAddress = async (req, res) => {
    try {
        const { userId, addresses } = req.body;

        console.log('Received Request Body:', req.body);

        // Validate the user ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate the addresses array
        if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
            return res.status(400).json({ message: 'Addresses are required and should be an array' });
        }

        // Check for required fields in each address
        for (let address of addresses) {
            console.log('Processing Address:', address);
            const { houseNo, street, city, state, zip, country, contactNo } = address;
            if (!houseNo || !street || !city || !state || !zip || !country || !contactNo) {
                return res.status(400).json({ message: 'All address fields are required' });
            }
        }

        // Find or create the Address document
        let addressDoc = await Address.findOne({ userId });
        if (!addressDoc) {
            addressDoc = new Address({ userId, addresses });
        } else {
            addressDoc.addresses.push(...addresses);
        }

        await addressDoc.save();
        res.status(201).json(addressDoc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all addresses for a user
export const getAddressesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const addressDoc = await Address.findOne({ userId });

        if (!addressDoc || addressDoc.addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

        res.status(200).json(addressDoc.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an address by user ID and address index
export const updateAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const { houseNo, street, city, state, zip, country, contactNo } = req.body;

        // Debug: Log userId and addressId
        console.log('userId:', userId);
        console.log('addressId:', addressId);

        // Find the address document by userId
        const addressDoc = await Address.findOne({ userId });

        // Debug: Log the fetched address document
        console.log('Fetched address document:', addressDoc);

        if (!addressDoc) {
            return res.status(404).json({ message: 'Address document not found' });
        }

        // Find the specific address within the addresses array by its _id
        const address = addressDoc.addresses.id(addressId);
        
        // Debug: Log the fetched address
        console.log('Fetched address:', address);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Update the address fields
        address.houseNo = houseNo;
        address.street = street;
        address.city = city;
        address.state = state;
        address.zip = zip;
        address.country = country;
        address.contactNo = contactNo;

        // Save the updated document
        await addressDoc.save();
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an address by user ID and address index
export const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        // Find the address document by userId
        const addressDoc = await Address.findOne({ userId });

        if (!addressDoc) {
            return res.status(404).json({ message: 'Address document not found' });
        }

        // Find the specific address within the addresses array by its _id
        const address = addressDoc.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Use pull method to remove the address from the addresses array
        addressDoc.addresses.pull(addressId);

        // Save the updated document
        await addressDoc.save();
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
