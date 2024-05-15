import express from 'express';
import authRoutes from './routes/authRoutes.mjs';

const app = express();
const PORT = 9000;

app.use(express.json());

app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
