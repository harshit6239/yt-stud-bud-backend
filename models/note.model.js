require("dotenv").config();
const mongoose = require("mongoose");
const Cryptr = require('cryptr');

const cryptr = new Cryptr(process.env.SECRET);

function encryptData(data) {
    try {
      const encryptedData = cryptr.encrypt(data);
      return encryptedData;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
}

function decryptData(encryptedData) {
    try {
      const decryptedData = cryptr.decrypt(encryptedData);
      return decryptedData;
    } catch (error) {
      console.error('Decryption error:', error);
      return null; 
    }
}

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videoId: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// noteSchema.pre("save", async function(next){
//     const note = this
//     if(note.isModified("title")){
//         note.title = cryptr.encrypt(note.title);
//     }
//     if(note.isModified("content")){
//         note.content = cryptr.encrypt(note.content);
//     }
//     if(note.isModified("videoId")){
//         note.videoId = cryptr.encrypt(note.videoId);
//     }
//     next();
// });

export default mongoose.model("Note", noteSchema);