import express from "express";
import productRouter from "./routes/products_routes";
import userRouter from "./routes/users_routes";
import dotenv from "dotenv";
import path from "path";
import { pool } from "./pool";
dotenv.config({ path: path.resolve(__dirname, "../config.env") });
pool.connect({
  host: process.env.DATABASE_LOCAL,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  idleTimeoutMillis: 300000,
});
// console.log(process.env);
const app = express();
app.use(express.json());
app.use("/user", userRouter);
app.use("/product", productRouter);
app.listen(3000);
