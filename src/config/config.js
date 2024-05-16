
// config.js
import dotenv from 'dotenv'
dotenv.config();

const config = {
    user: process.env.DB_USER || 'postgres', 
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME 
    password: process.env.DB_PASSWORD 
    port: process.env.DB_PORT || 5432 // PostgreSQL default port is 5432
};

export default config;
