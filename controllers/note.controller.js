import Folder from "../models/folder.model.js";
import Note from "../models/note.model.js";
import Item from "../models/item.model.js";
import { findVideoById } from "../yt-v3.js";
import { z } from "zod";

const createFolderSchema = z.object({
    name: z
    .string({required_error: "Name is required"})
    .min(1, {message: "Name must be at least 1 character"})
    .max(20, {message: "Name must be at most 20 characters"})
    .trim(),
    parent: z.string().optional()
});

const createNote = async (req, res) => {
    let {parent,videoId} = req.body;
    if(!videoId){
        res.status(400).json({ message: "Video ID is required" });
        return;
    }
    const video = await findVideoById(videoId);
    if(!video){
        res.status(404).json({ message: "Video not found" });
        return;
    }
    const notes = await Item.find({ user: req.user.id, type: "note", parent: (parent? parent : null) }).populate("noteId");
    for(let note of notes){
        if(note.noteId.videoId==videoId){
            res.status(200).json({ message: "Note already exists", note });
            return;
        }
    }
    try{
        const note = new Note({ user: req.user.id, videoId, content: "" });
        await note.save();
        let item;
        if(parent!=undefined){
            item = new Item({ type: "note", parent, user: req.user.id, noteId: note._id });
        }
        else{
            item = new Item({ type: "note", user: req.user.id, noteId: note._id });
        }
        await item.save();
        item.noteId = note;
        res.status(201).json({ message: "Note created successfully", note: item });
        return;
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
        return;
    }
}

const getNote = async (req, res) => {
    try{
        const note = await Note.findById(req.query.id);
        if(!note){
            res.status(404).json({ message: "Note not found" });
            return;
        }
        res.status(200).json({ note });
        return;
    }
    catch(error){
        res.status(500).json({ message: error.message });
        return;
    }
}

const updateNote = async (req, res) => {
    try{
        const { id, content } = req.body;
        if(!id){
            res.status(400).json({ message: "Note ID is required" });
            return;
        }
        if(!content){
            res.status(400).json({ message: "Content is required" });
            return;
        }
        Note.findByIdAndUpdate(id, { content }, { new: true }).then(note => {
            if(!note){
                res.status(404).json({ message: "Note not found" });
                return;
            }
            res.status(200).json({ message: "Note updated successfully", note });
            return;
        }).catch(error => {
            res.status(500).json({ message: error.message });
            return;
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
        return;
    }
}

const deleteNote = async (req, res) => {
    try{
        const { id } = req.body;
        if(!id){
            res.status(400).json({ message: "Note ID is required" });
            return;
        }
        Note.findByIdAndDelete(id).then(note => {
            if(!note){
                res.status(404).json({ message: "Note not found" });
                return;
            }
            Item.findOneAndDelete({ noteId: id }).then(item => {
                if(!item){
                    res.status(404).json({ message: "Item not found" });
                    return;
                }
                res.status(200).json({ message: "Note deleted successfully" });
                return;
            }).catch(error => {
                res.status(500).json({ message: error.message });
                return;
            })
        }).catch(error => {
            res.status(500).json({ message: error.message });
            return;
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
        return;
    }
}

const createFolder = async (req, res) => {
    let parent;
    let name;
    try{
        ({ name, parent } = createFolderSchema.parse(req.body));
    }
    catch(error){
        res.status(400).json({ message: error.errors[0].message });
        return;
    }
    try{
        let folders;
        if(parent!=undefined){
            folders = await Item.find({ user: req.user.id, type: "folder", parent }).populate("folderId");
        }
        else{
            folders = await Item.find({ user: req.user.id, type: "folder", parent:null }).populate("folderId");
        }
        for(let folder of folders){
            if(folder.folderId.name==name){
                res.status(400).json({ message: "Folder with same name already exists" });
                return;
            }
        }
        const folder = new Folder({ name, user: req.user.id });
        await folder.save();
        let item;
        if(parent!=undefined){
            item = new Item({ type: "folder", parent, user: req.user.id, folderId: folder._id });
        }
        else{
            item = new Item({ type: "folder", user: req.user.id, folderId: folder._id });
        }
        await item.save();
        item.folderId = folder;
        res.status(201).json({ message: "Folder created successfully", folder: item });
        return;
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
        return;
    }
}

const deleteFolder = async (req, res) => {
    try{
        const { id } = req.body;
        if(!id){
            res.status(400).json({ message: "Folder ID is required" });
            return;
        }
        let folders = [];
        folders.push(id);
        let notes = [];
        for(let i=0;i<folders.length;i++){
            let childFolders = await Item.find({ user: req.user.id, type: "folder", parent: folders[i] }).populate("folderId");
            let childNotes = await Item.find({ user: req.user.id, type: "note", parent: folders[i] }).populate("noteId");
            for(let folder of childFolders){
                folders.push(folder.folderId._id);
            }
            for(let note of childNotes){
                notes.push(note.noteId._id);
            }
        }
        for(let note of notes){
            await Note.findByIdAndDelete(note);
            await Item.findOneAndDelete({ noteId: note });
        }
        for(let folder of folders){
            await Folder.findByIdAndDelete(folder);
            await Item.findOneAndDelete({ folderId: folder });
        }
        res.status(200).json({ message: "Folder deleted successfully" });
        return;
    }
    catch(error){
        res.status(500).json({ message: error.message });
        return;
    }
}

const getItems = async (req, res) => {
    try{
        let parentName;
        if(req.query.folder){
            try{
                const parent = await Folder.findById(req.query.folder);
                parentName = parent.name;
            }
            catch(error){
                res.status(404).json({ message: "Folder not found" });
                return;
            }
        }
        else{
            parentName = "Home";
        }
        let folders, notes;

        if(!!req.query?.folder){
            folders = await Item.find({ user: req.user.id, parent: req.query.folder, type: "folder" }).populate("folderId");
            notes = await Item.find({ user: req.user.id, parent: req.query.folder, type: "note" }).populate("noteId");
        }
        else{
            folders = await Item.find({ user: req.user.id, parent: null, type: "folder" }).populate("folderId");
            notes = await Item.find({ user: req.user.id, parent: null, type: "note" }).populate("noteId");
        }
        res.status(200).json({ notes, folders, parentName });
        return;
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
        return;
    }
}

export { createNote, getNote, updateNote, deleteNote, createFolder, deleteFolder, getItems };