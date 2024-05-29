import express from 'express';
import run from './gemini-start.js';
import connectDB from './db/index.js';
import create from './models/user.model.js';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.get('/gemini',async (req, res) => {
    // console.log(req.query.query);
    const query = req.query.query; 
    const result = await run(query);
    res.send(result);
    }
);
// app.get('/ytframe/:vid',async (req, res) => {
//     const result = await getEmbeddedVideo(req.params.vid);
//     res.send(result);
//     }
// );
app.post('/register',async (req, res) => {
    try{
        const {email, password, confirmPassword} = req.body;
        const User = await create({email, password});
        console.log(User);
        res.status(201).send(User);
    }
    catch(error){
        res.status(400).send(error);
    }
});


connectDB().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
        }
    );
})
