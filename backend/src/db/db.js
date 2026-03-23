"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const mysql2_1 = require("drizzle-orm/mysql2");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Tạo connection pool chung cho cả Drizzle ORM và raw SQL queries (stored procedures/functions)
exports.pool = promise_1.default.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: Number(process.env.DATABASE_PORT) || 3306,
    connectionLimit: 10,
});
// Export drizzle instance để dùng ORM
exports.db = (0, mysql2_1.drizzle)(exports.pool);
