import ProductRepository from "./products.repository.js";
import mongoose from "mongoose";

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAll(req, res) {
        try {
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
    }

    async getbyId(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send('Invalid Product ID');
            }
            const product = await this.productRepository.getByID(id);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            res.status(200).send(product);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
    }

    async addProduct(req, res) {
        const userID = req.userID;
        console.log(req.file.filename);
        const imageUrl = req.file ? req.file.filename : null;

        if (!imageUrl) {
            console.error('No file uploaded or Multer configuration issue.');
            return res.status(400).send('File upload failed.');
        }

        const prod = req.body;
        prod.imageUrl = imageUrl;
        try {
            const products = await this.productRepository.add(userID, prod);
            console.log("image ", products.imageUrl);
            res.status(201).send(products);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error")
        }
    }

    async filterProd(req, res) {
        try {
            const { minPrice, maxPrice, category, company } = req.query;
            const result = await this.productRepository.filter(
                minPrice,
                maxPrice,
                category,
                company
            );
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }


    async update(req, res) {
        try {
            const userID = req.userID;
            const prodID = req.params.prodId;
            const prod = req.body;
            const product = await this.productRepository.update(userID, prodID, prod);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            res.status(200).send(product);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    async rateProduct(req, res) {
        try {
            const userID = req.userID;
            const prodID = req.params.prodId;
            const rating = req.body.rating;
            const result = await this.productRepository.rate(userID, prodID, rating);
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    async delete(req, res) {
        try {
            const userID = req.userID;
            const prodID = req.params.productId;
            const product = await this.productRepository.delete(userID, prodID);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            res.status(200).send(product);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

}