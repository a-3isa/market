import { Request, Response } from "express";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "0000",
  database: "market",
  port: 5432,
  idleTimeoutMillis: 30000,
});

export class ProductController {
  createProduct = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if ("admin" !== user.role) {
      throw new Error("You do not have permission to perform this action");
    }
    const { name, price, image, owner_id } = req.body;
    try {
      const insertProduct =
        "INSERT INTO products (name, price, quantity, image, owner_id) VALUES ($1, $2,$3,$4,$5) RETURNING *";
      const result = await pool.query(insertProduct, [
        name,
        price,
        image,
        user.id,
      ]);
      const createdProduct = result.rows[0];
      res.json(createdProduct);
    } catch (err) {
      res.json("error");
      //   next(err);
    }
  };
  getProducts = async (req: Request, res: Response) => {
    console.log((req as any).user);
    const getProducts = "SELECT * FROM products;";
    const result = await pool.query(getProducts);
    res.json(result.rows);
  };
}

// export const productController = new ProductController();
