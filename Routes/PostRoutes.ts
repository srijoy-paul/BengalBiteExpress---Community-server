const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const pool = require("../db_config/db");

const jwtCheck = require("../middlewares/auth");
const parseJWT = require("../middlewares/parseJWT");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

router.post(
  "/createPost",
  jwtCheck,
  parseJWT,
  upload.array("file", 4),
  async (req: any, res: any) => {
    try {
      const { caption, location, tags } = req.body;
      // console.log(caption, location, tags);
      // console.log("user from post creatrion", req.user);
      // console.log(req.files);

      const imgUrlArray = [];
      for (const imgFile of req.files) {
        // console.log(imgFile);
        const base64Image = Buffer.from(imgFile.buffer).toString("base64");
        const dataURI = `data:${imgFile.mimetype};base64,${base64Image}`;
        // console.log("hi");

        let uploadResponse = await cloudinary.uploader.upload(dataURI);
        // console.log("hello");
        imgUrlArray.push(uploadResponse.url);
      }

      // console.log(imgUrlArray);

      const newPostData = {
        creator_id: req?.user?.id,
        caption,
        location,
        imageurl: imgUrlArray,
        tags: tags?.split(","),
        created_at: new Date(),
      };
      // console.log(newPostData.imageurl);

      const newPost = await pool.query(
        "INSERT INTO posts(creator_id,caption,location,imageurl,created_at,tags)VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          newPostData.creator_id,
          newPostData.caption,
          newPostData.location,
          newPostData.imageurl,
          newPostData.created_at,
          newPostData.tags,
        ]
      );
      console.log(newPost?.rows[0]);
      res.status(201).json(newPost?.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/allPosts", async (req: any, res: any) => {});

module.exports = router;

export {};
