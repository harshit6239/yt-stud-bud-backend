import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        length: { min: 6 }
    }
}, { timestamps: true });

// userSchema.pre("save", async function(next){
//     const user = this;
//     if(user.isModified("password")){
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

// userSchema.methods.matchPassword = async function(password){
//     return await bcrypt.compare(password, this.password);
// }

export default mongoose.model("User", userSchema);