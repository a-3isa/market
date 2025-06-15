import { Pool } from "pg";

class POOL {
  _pool!: Pool;
  connect(options: any) {
    this._pool = new Pool(options);
  }
  query(sql: string, values: Array<any> = []) {
    return this._pool.query(sql, values);
  }
}

export const pool = new POOL();
