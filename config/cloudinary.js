const cloudinary = require("cloudinary")


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.API_SECRET_KEY
  });

  
module.exports = cloudinary