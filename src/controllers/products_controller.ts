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
    const product = req.body;
    // 1. Insert product
    const productResult = await pool.query(
      `INSERT INTO products (name, price, quantity, image, owner_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        product.name,
        product.price,
        product.quantity,
        product.image,
        product.owner_id,
      ]
    );
    const productId = productResult.rows[0].id;

    // 2. Loop through options
    for (const option of product.options) {
      const optionResult = await pool.query(
        `INSERT INTO product_options (product_id, name)
         VALUES ($1, $2)
         RETURNING id`,
        [productId, option.name]
      );
      const optionId = optionResult.rows[0].id;

      // 3. Insert each value for the option
      for (const value of option.values) {
        await pool.query(
          `INSERT INTO product_option_values (option_id, value)
           VALUES ($1, $2)`,
          [optionId, value]
        );
      }
    }
    res.json("Product and options inserted successfully.");
  };
  getProducts = async (req: Request, res: Response) => {
    try {
      const role = (req as any).user.role;
      let productsQuery;

      if (role === "admin") {
        productsQuery = "SELECT * FROM products;";
        // const result = await pool.query("SELECT * FROM products;");
        // res.json(result.rows);
        // return;
      } else {
        productsQuery = `SELECT id, name, image, price FROM products;`;
      }

      // For clients: fetch limited fields

      const productsResult = await pool.query(productsQuery);
      const products = productsResult.rows;

      // Get options for all product IDs
      const productIds = products.map((p) => p.id);
      if (productIds.length === 0) {
        res.json([]);
        return;
      }

      const optionsQuery = `
      SELECT po.product_id, po.name AS option_name, pov.value
      FROM product_options po
      JOIN product_option_values pov ON po.id = pov.option_id
      WHERE po.product_id = ANY($1)
    `;
      const optionsResult = await pool.query(optionsQuery, [productIds]);

      // Group options by product
      const groupedOptions: { [key: number]: any[] } = {};
      optionsResult.rows.forEach((row) => {
        if (!groupedOptions[row.product_id]) {
          groupedOptions[row.product_id] = [];
        }

        let option = groupedOptions[row.product_id].find(
          (opt) => opt.name === row.option_name
        );
        if (!option) {
          option = { name: row.option_name, values: [] };
          groupedOptions[row.product_id].push(option);
        }
        option.values.push(row.value);
      });

      // Attach options to each product
      const finalProducts = products.map((product) => ({
        ...product,
        options: groupedOptions[product.id] || [],
      }));

      res.json(finalProducts);
    } catch (error) {
      console.error("Error fetching client products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

// export const productController = new ProductController();
