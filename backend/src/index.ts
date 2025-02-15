import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { PORT,  server } from "./app";
import { dbConnection } from "./config/dbConfig";

dotenv.config();

const HOST = '0.0.0.0';

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Start the server
server.listen(PORT,() => {
    dbConnection();
 
});

