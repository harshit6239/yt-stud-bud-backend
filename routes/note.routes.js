import express from 'express';
import imageUpload from '../utils/imageUpload.js';
import run from '../gemini-start.js';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import validateToken from '../middleware/validateToken.js';
import { createNote, getNote, getNotesFromVid, updateNote, deleteNote, getItems, createFolder, deleteFolder } from '../controllers/note.controller.js';

const upload = multer({ dest: 'uploads/'});

const router = express.Router();

router.use(cookieParser());

router.use(validateToken);

router.get('/', (req, res)=>{
    getNotesFromVid(req, res);
})

router.post('/items/note', (req, res) => {
    createNote(req, res);
});

router.get('/items/note', (req, res) => {
    getNote(req, res);
})

router.patch('/items/note', (req, res) => {
    updateNote(req, res);
});

router.post('/items/note/delete', (req, res) => {
    deleteNote(req, res);
});

router.get('/items', (req, res) => {
    getItems(req, res);
});

router.post('/items/folder', (req, res) => {
    createFolder(req, res);
});

router.post('/items/folder/delete', (req, res)=>{
    deleteFolder(req, res);
})

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