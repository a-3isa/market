"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: "localhost",
    user: "postgres",
    password: "0000",
    database: "market",
    port: 5432,
    idleTimeoutMillis: 30000,
});
const signToken = (id) => {
    const JWT_SECRET = "ahmed";
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
    return jsonwebtoken_1.default.sign({ _id: id }, JWT_SECRET, {
        expiresIn: "2 days",
    });
};
const createSendToken = (id, statusCode, res) => {
    const token = signToken(id);
    const cookieExpiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7; // fallback to 7 days
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        token,
    });
};
class AuthController {
    constructor() {
        this.signup = async (req, res, next) => {
            const { name, role, password } = req.body;
            const insertUser = "INSERT INTO users (name, role,password) VALUES ($1, $2,$3) RETURNING *";
            const result = await pool.query(insertUser, [name, role, password]);
            createSendToken(result.rows[0].id, 201, res);
        };
        this.login = async (req, res, next) => {
            const { name, password } = req.body;
            // 1) Check if email and password exist
            if (!name || !password) {
                throw new Error("Please provide email and password!");
            }
            // 2) Check if user exists && password is correct
            // const user = await User.findOne({ email }).select("+password");
            const user = "SELECT * FROM users WHERE name = $1";
            const result = await pool.query(user, [name]);
            if (!result || !(result.rows[0].password == password)) {
                throw new Error("Incorrect email or password");
            }
            // 3) If everything ok, send token to client
            createSendToken(result.rows[0].id, 200, res);
        };
        this.protect = async (req, res, next) => {
            // 1) Getting token and check of it's there
            let token;
            if (req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            }
            // console.log(token);
            if (!token) {
                throw new Error("You are not logged in! Please log in to get access.");
            }
            // 2) Verification token
            const decoded = (await jsonwebtoken_1.default.verify(token, "ahmed"));
            // console.log(decoded);
            // 3) Check if user still exists
            // const currentUser = await User.findById(decoded.id);
            const currentUser = "SELECT * FROM users WHERE id = $1";
            const result = await pool.query(currentUser, [decoded._id]);
            if (!result) {
                throw new Error("The user belonging to this token does no longer exist.");
            }
            // 4) Check if user changed password after the token was issued
            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //   throw new Error("User recently changed password! Please log in again.");
            // }
            // GRANT ACCESS TO PROTECTED ROUTE
            req.user = result.rows[0];
            next();
        };
        //   restrictTo: RequestHandler = (...roles) => {
        //     return (req, res, next) => {
        //       // roles ['admin', 'lead-guide']. role='user'
        //       if (!roles.includes(req.user.role)) {
        //         throw new Error("You do not have permission to perform this action");
        //       }
        //       next();
        //     };
        //   };
    }
}
exports.authController = new AuthController();
