import { Pool } from "pg";
import {drizzle} from "drizzle-orm/node-postgres"
import dotenv from 'dotenv'

dotenv.config()
//local DB
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL_LOCAL,
//     ssl: {rejectUnauthorized: false}
// })

//premote DB 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})


export const db = drizzle(pool)