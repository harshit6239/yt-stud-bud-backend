import express from 'express';
import validateSchema from '../middleware/validateSchema.js';
import { registerUser, loginUser, loginSchema, registerSchema, logoutUser } from "../controllers/user.controller.js";
import cookieParser from 'cookie-parser';
import validateToken from '../middleware/validateToken.js';

const router = express.Router();

router.use(cookieParser());

router.get('/validate', validateToken, (req, res) => {
    res.status(200).json({ message: "User is validated" });
})

router.post('/login', validateSchema(loginSchema), (req, res) => {
    console.log(req.body);
    loginUser(req, res);
});
router.post('/register', validateSchema(registerSchema), (req, res) => {
    registerUser(req, res);
});
router.get('/logout', (req, res) => {
    logoutUser(req, res);
});

export default router;