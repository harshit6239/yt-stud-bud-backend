import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: false,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
    }
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);