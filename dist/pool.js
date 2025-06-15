"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
class POOL {
    connect(options) {
        this._pool = new pg_1.Pool(options);
    }
    query(sql, values = []) {
        return this._pool.query(sql, values);
    }
}
exports.pool = new POOL();
