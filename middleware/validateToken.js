import jwt from 'jsonwebtoken';

export default function validateToken(req, res, next){
    let token = req.cookies.token;
    if(!token) token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Invalid token" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};