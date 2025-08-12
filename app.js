import express from 'express';
import { PORT } from './config/env.js';

const app = express();

app.get('/',(req,res) => {
    res.send("Welcome!");
});

app.listen(PORT, () => {
    console.log(`(i) - API is running on http://localhost:${PORT}`);
});

export default app;
