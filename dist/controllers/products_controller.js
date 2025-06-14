"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: "localhost",
    user: "postgres",
    password: "0000",
    database: "market",
    port: 5432,
    idleTimeoutMillis: 30000,
});
class ProductController {
    constructor() {
        this.createProduct = async (req, res) => {
            const user = req.user;
            if ("admin" !== user.role) {
                throw new Error("You do not have permission to perform this action");
            }
            const { name, price, image, owner_id } = req.body;
            try {
                const insertProduct = "INSERT INTO products (name,price, image , owner_id) VALUES ($1, $2,$3,$4) RETURNING *";
                const result = await pool.query(insertProduct, [
                    name,
                    price,
                    image,
                    user.id,
                ]);
                const createdProduct = result.rows[0];
                res.json(createdProduct);
            }
            catch (err) {
                res.json("error");
                //   next(err);
            }
        };
        this.getProducts = async (req, res) => {
            console.log(req.user);
            const getProducts = "SELECT * FROM products;";
            const result = await pool.query(getProducts);
            res.json(result.rows);
        };
    }
}
exports.ProductController = ProductController;
// export const productController = new ProductController();
