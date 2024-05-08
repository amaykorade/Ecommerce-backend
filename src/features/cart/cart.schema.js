import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }
    // productID: String
})