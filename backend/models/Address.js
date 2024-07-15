import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    addresses: [{
        houseNo: {
            type: String,
        },
        street: { 
            type: String,
        },
        city: { 
            type: String,
        },
        state: { 
            type: String,
        },
        zip: { 
            type: String,
        },
        country: { 
            type: String,
        },
        contactNo: {
            type: String,
        }
    }] // Nested addresses array
}, { timestamps: true });


export default model('Address', addressSchema);
