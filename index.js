import express from "express";
import connectDB from "./db/index.js";
import noteRoutes from "./routes/note.routes.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import path from "path";

const app = express();

const port = 3000;

app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.use("/api/note", noteRoutes);

app.use("/api/user", userRoutes);

// ------------------Deployment------------------

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "frontend", "build", "index.html")
        );
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

// ------------------Deployment------------------

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
