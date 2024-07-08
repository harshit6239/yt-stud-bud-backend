import Folder from "../models/folder.model.js";
import Note from "../models/note.model.js";
import Item from "../models/item.model.js";
import { z } from "zod";

const createFolderSchema = z.object({
    name: z
    .string({required_error: "Name is required"})
    .min(1, {message: "Name must be at least 1 character"})
    .max(20, {message: "Name must be at most 20 characters"})
    .trim(),
    parent: z.string().optional()
});

const getAllFolders = async (req, res) => {
    try{
        const folders = await Item.find({ type: "folder", user: req.user.id }).populate("folderId");
        res.status(200).json(folders);
        return;
    }
    catch(error){
        console.log(error);
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

export { getAllFolders, createFolder, getItems };