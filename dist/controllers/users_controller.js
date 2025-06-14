"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: "localhost",
    user: "postgres",
    password: "0000",
    database: "market",
    port: 5432,
    idleTimeoutMillis: 30000,
});
class UserController {
    constructor() {
        this.followUser = async (req, res) => {
            const follower = req.user;
            console.log(req.body);
            const { following_id } = req.body;
            try {
                const insertUser = "INSERT INTO followers (following_id, follower_id) VALUES ($1, $2) RETURNING *";
                const result = await pool.query(insertUser, [following_id, follower.id]);
                const createdUser = result.rows[0];
                res.json(createdUser);
            }
            catch (err) {
                res.json(err);
                //   next(err);
            }
        };
    }
}
exports.UserController = UserController;
// export const productController = new ProductController();
