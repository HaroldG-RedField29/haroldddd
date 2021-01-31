const {Router, response} = require('express');
const router = Router();
const fs = require('fs-extra');
const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');
//const AWS = require('aws-sdk');
//const path = require('path');
//const fss   = require('fs');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

/*const s3 = new AWS.S3({
    accessKeyId: "ASIAUREROCGIPHYXUIT3",
    secretAccessKey:"vCu2O8f5udsEBsmVmin1JkYzJ+4UQdED3hnKtTIi",
    sessionToken: "FwoGZXIvYXdzEPn//////////wEaDMaV1CF/aWp/KtLQRiLIAcbjkGxVPUXfFTzzjw+Ap061NX+7uYsGAsICWlU5ULOZ8w+7B5liLdlTe+8SJci4MqN7AX2i7n7RcoarQMsCl0O6xjo8ojPGJc3YJpMbc6moY7FoEv0ZztyX9CVXXGrsTbsx8SyHrJ27Myj6EevH6/s/U8LEC1xwv91iBWqooxAiADVGyeU0kVpMhg3O6yOknlRhk+kEb3YO5RGMdq+nJG9zKdkI4AO3jlSMy5sNu84mhKS4LRr72C1RAqF6eR4jG2illatq2GoeKOXiyv4FMi1Uq5UVERw5I2DeKb/GmyFwMqsf9L6RNzAHtIk9Co7JcWQVDAI0dRVlF83ZzAI="
  });*/

router.get('/', async (req,res)=>{
    const photos = await Photo.find();
    //console.log(photos)
    res.render('images', {photos});
});

router.get('/images/add', async (req, res) =>{
    const photos = await Photo.find();
    res.render('image_form', {photos});
});

router.post('/images/add', async (req, res) => {

    const {title, description,album,des,genero}=req.body;
    //console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    //const result = await s3.v2.uploader.upload(req.file.path);
    
    //console.log(result)

    //var filePath = "image";

    //var params = {
        //Bucket : 'mi-almacenamiento',
      //};


    /*s3.upload(params , function (err, data) {
        //en caso de error
        if (err) {
          //console.log("Error", err);
        }
      
        // el archivo se ha subido correctamente
        if (data) {
          //console.log("Uploaded in:", data.Location);
        }
      });*/


    const newPhoto = new Photo({
        title,
        description,
        album,
        des,
        genero,
        imageURL: result.url,
        public_id: result.public_id
    });

    await newPhoto.save();
    await fs.unlink(req.file.path)   
    res.redirect('/');
});

router.get('/images/delete/:photo_id', async(req, res)=>{
    const {photo_id} = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    //const result = await s3.v2.uploader.destroy(photo.public_id);
    console.log(result);
    res.redirect('/images/add');
});
module.exports = router;