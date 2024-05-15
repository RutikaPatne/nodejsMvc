import express from 'express';
import authRoutes from './routes/authRoutes.mjs';
import dotenv from'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
