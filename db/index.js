import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        console.log(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        const connection = await connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    }
    catch(error){
        console.log("MONGODB CONNECTION ERROR: ", error);
        process.exit(1);
    }
}
export default connectDB;