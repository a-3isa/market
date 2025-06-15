"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_routes_1 = __importDefault(require("./routes/products_routes"));
const users_routes_1 = __importDefault(require("./routes/users_routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const pool_1 = require("./pool");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../config.env") });
pool_1.pool.connect({
    host: process.env.DATABASE_LOCAL,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    idleTimeoutMillis: 300000,
});
// console.log(process.env);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/user", users_routes_1.default);
app.use("/product", products_routes_1.default);
app.listen(3000);
