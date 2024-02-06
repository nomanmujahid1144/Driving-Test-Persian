const express = require('express');
const router = express.Router();
const {
    AddBlog,
    GetBlog,
    GetBlogById,
    AddBlogImage,
    deleteBlog,
    updateBlog
} = require('../controllers/blog.controllers')

router.post('/addblog', AddBlog)
router.get('/getblogs', GetBlog)
router.get('/getblogbyid', GetBlogById)
router.post('/addblogimg', AddBlogImage)
router.delete('/deleteblog', deleteBlog)
router.post('/updateblog', updateBlog)


module.exports = router;