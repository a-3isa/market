/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Users table
  pgm.createTable("users", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(300)", notNull: true },
    role: { type: "varchar(6)", notNull: true },
    password: { type: "varchar(255)", notNull: true }, // Added this line
  });

  // User followers relationship table
  pgm.createTable("followers", {
    following_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    follower_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
  });

  pgm.addConstraint("users", "role_check", {
    check: `role IN ('admin', 'client')`,
  });

  // Add composite primary key
  pgm.addConstraint("followers", "user_follower_pk", {
    primaryKey: ["following_id", "follower_id"],
  });

  pgm.addConstraint("followers", "user_cannot_follow_self", {
    check: `"following_id" <> "follower_id"`,
  });

  // Products table
  pgm.createTable("products", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(200)", notNull: true },
    price: { type: "numeric(10, 2)", notNull: true },
    quantity: { type: "numeric(10, 2)", notNull: true },
    image: { type: "text", notNull: true }, // Image URL or path
    owner_id: {
      type: "integer",
      references: "users(id)",
      onDelete: "cascade",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("product_options", {
    id: { type: "serial", primaryKey: true },
    product_id: {
      type: "integer",
      references: "products(id)",
      onDelete: "cascade",
      notNull: true,
    },
    name: { type: "varchar(100)", notNull: true }, // e.g., "Size", "Color"
  });

  pgm.createTable("product_option_values", {
    id: { type: "serial", primaryKey: true },
    option_id: {
      type: "integer",
      references: "product_options(id)",
      onDelete: "cascade",
      notNull: true,
    },
    value: { type: "varchar(100)", notNull: true }, // e.g., "S", "M", "Red"
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("product_option_values");
  pgm.dropTable("product_options");
  pgm.dropTable("products");
  pgm.dropConstraint("followers", "user_follower_pk");
  pgm.dropTable("followers");
  pgm.dropTable("users");
};
