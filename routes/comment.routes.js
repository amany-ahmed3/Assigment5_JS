const express = require('express');
const router = express.Router();

const {
    createBulkComments,
    updateComment,
    findOrCreateComment,
    searchComments,
    getNewestComments,
    getCommentDetails
} = require('../controllers/comment.controller');

router.post('/find-or-create', findOrCreateComment);
router.get('/search', searchComments);
router.get('/newest/:postId', getNewestComments);
router.get('/details/:id', getCommentDetails);
router.patch('/:commentId', updateComment);
router.post('/', createBulkComments);

module.exports = router;