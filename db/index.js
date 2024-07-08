import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        const connection = await connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        return connection;
    }
    catch(error){
        console.log("MONGODB CONNECTION ERROR: ", error);
        process.exit(1);
    }
}
export default connectDB;