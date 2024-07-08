import { v2 as cloudinary } from 'cloudinary';

async function imageUpload(image) {

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
     const uploadResult = await cloudinary.uploader
       .upload(image)
       .catch((error) => {
           console.log(error);
       });
    
    return uploadResult;
};

export default imageUpload;