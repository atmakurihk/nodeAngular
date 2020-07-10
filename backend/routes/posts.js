const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const postController = require('../controllers/post');



router.post("",checkAuth,extractFile,postController.createPost);

router.put("/:id", checkAuth,extractFile,postController.updatePost);

router.get("", postController.getAllPosts);
router.get('/:id',postController.getOnePost);

router.delete("/:id",checkAuth,postController.deletePost);

module.exports =router;
