import User from '../models/user.model.js';
import { isEmail } from 'validator';

const registerUser = async (req, res) => {
    try{
        const {email, password, confirmPassword} = req.body;
        if( [email, password, confirmPassword].some((field)=>(field?.trim()===''||field?.trim()==undefined)) ){
            throw new Error("Please fill in all fields");
        }
        if(password !== confirmPassword){
            throw new Error("Passwords do not match");
        }
        if(password.length < 6){
            throw new Error("Password must be at least 6 characters long");
        }
        if(isEmail(email) === false){
            throw new Error("Please enter a valid Email address");
        }
        const user = new User(req.body);
        await user.save();
        // const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch(error){
        res.status(400).send(error);
    }
}

const loginUser = async (req, res) => {

};

export default { registerUser, loginUser };