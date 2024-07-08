import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    note: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    }
}, { timestamps: true });


export default mongoose.model("Note", noteSchema);