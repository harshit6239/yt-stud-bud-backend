import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        trim: true,
        default: ""
    },
    markdown: {
        type: String,
        trim: true,
        default: ""
    },
    videoId: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true });


export default mongoose.model("Note", noteSchema);