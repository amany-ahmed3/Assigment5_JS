const express = require('express');
const router = express.Router();

const {
    createPost,
    deletePost,
    getPostDetails,
    getPostCommentCount
} = require('../controllers/post.controller');

router.post('/', createPost);
router.delete('/:postId', deletePost);
router.get('/details', getPostDetails);
router.get('/comment-count', getPostCommentCount);

module.exports = router;