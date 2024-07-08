import express from 'express';
import imageUpload from '../utils/imageUpload.js';
import run from '../gemini-start.js';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import validateToken from '../middleware/validateToken.js';
import { getAllFolders, getItems, createFolder } from '../controllers/note.controller.js';

const upload = multer({ dest: 'uploads/'});

const router = express.Router();

router.use(cookieParser());

router.use(validateToken);

router.get('/test/folder', (req, res)=>{
    getAllFolders(req, res);
})

router.get('/items', (req, res) => {
    getItems(req, res);
});

router.post('/items/folder', (req, res) => {
    createFolder(req, res);
});

router.post('/upload', upload.single('image'), async (req, res) => {
    const file = req.file;
    const result = await imageUpload(file.path);
    res.send(result.url);
    }
);

router.get('/gemini',async (req, res) => {
    const query = req.query.query; 
    const result = await run(query);
    res.send(result);
    }
);

export default router;