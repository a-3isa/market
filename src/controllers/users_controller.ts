import { Request, RequestHandler, Response } from "express";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "0000",
  database: "market",
  port: 5432,
  idleTimeoutMillis: 30000,
});

export class UserController {
  followUser: RequestHandler = async (req: Request, res: Response) => {
    const follower = (req as any).user;
    console.log(req.body);
    const { following_id } = req.body;
    try {
      const insertUser =
        "INSERT INTO followers (following_id, follower_id) VALUES ($1, $2) RETURNING *";
      const result = await pool.query(insertUser, [following_id, follower.id]);
      const createdUser = result.rows[0];
      res.json(createdUser);
    } catch (err) {
      res.json(err);
      //   next(err);
    }
  };
}

// export const productController = new ProductController();
