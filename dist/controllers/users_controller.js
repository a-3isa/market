"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const pool_1 = require("../pool");
// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "0000",
//   database: "market",
//   port: 5432,
//   idleTimeoutMillis: 30000,
// });
class UserController {
    constructor() {
        this.followUser = async (req, res) => {
            const follower = req.user;
            console.log(req.body);
            const { following_id } = req.body;
            try {
                const insertUser = "INSERT INTO followers (following_id, follower_id) VALUES ($1, $2) RETURNING *";
                const result = await pool_1.pool.query(insertUser, [following_id, follower.id]);
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
