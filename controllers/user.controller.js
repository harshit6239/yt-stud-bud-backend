import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';



const registerSchema = z.object({
    username: z
    .string({required_error: "Username is required"})
    .min(3, {message: "Username must be at least 3 characters"})
    .max(15, {message: "Username must be at most 15 characters"}),
    email: z
    .string({required_error: "Email is required"})
    .email({message: "Invalid email"}),
    password: z
    .string({required_error: "Password is required"})
    .min(6, {message: "Password must be at least 6 characters"})
    .max(15, {message: "Password must be at most 15 characters"}),
    confirmPassword: z
    .string({required_error: "Confirm password is required"})
    .min(6, {message: "Password must be at least 6 characters"})
    .max(15, {message: "Password must be at most 15 characters"})
}).refine((data) => data.password === data.confirmPassword, {message: "Passwords do not match"});

const loginSchema = z.object({
    email: z
    .string({required_error: "Email is required"})
    .email({message: "Invalid email"}),
    password: z
    .string({required_error: "Password is required"})
    .min(6, {message: "Password must be at least 6 characters"})
    .max(15, {message: "Password must be at most 15 characters"})
});

const registerUser = async (req, res) => {
    const { username, email, password } = registerSchema.parse(req.body);
    try{
        const user = new User({ username, email, password });
        await user.save();
        const token = jwt.sign({ 'id':user._id.toString(), email, username:user.username.toString() }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({ message: "User created successfully" });
        return;
    }
    catch(error){
        console.log(error);
        if(error.code === 11000){
            if(error.keyValue.username){
                res.status(400).json({ message: "Username already exists" });
                return;
            }
            else{
                res.status(400).json({ message: "Email already exists" });
                return;
            }
        }
        else{
            res.status(500).json({ message: error.message });
            return;
        }
    }
}

const loginUser = async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    try{
        const user = await User.findOne({ email });
        if(!user){
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ 'id':user._id.toString(), email, username:user.username.toString() }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ token, message: "User logged in successfully" });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}

export { registerUser, loginUser, registerSchema, loginSchema, logoutUser };