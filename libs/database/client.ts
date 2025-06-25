import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';
import { config } from '@config';

// 创建连接池
export const pool = new Pool({
  connectionString: config.database.url,
});

// 创建 Drizzle 客户端
export const db = drizzle(pool); 