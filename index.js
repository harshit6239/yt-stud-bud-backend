import express from 'express';
import connectDB from './db/index.js';
import noteRoutes from './routes/note.routes.js';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
import { findVideoById } from './yt-v3.js';

const app = express();

const port = 3000;

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/api/note', noteRoutes);

app.use('/api/user', userRoutes);

connectDB().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
        }
    );
})
