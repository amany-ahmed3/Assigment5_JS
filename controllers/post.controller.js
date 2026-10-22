const { User, Post, Comment } = require('../models');
// post APIs >>  1- create new post
async function createPost(req, res) {
    try {
        const { title, content, userId } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const post = new Post({
            title,
            content,
            userId
        });

        await post.save();

        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// 2- Delete post by ID

async function deletePost(req, res) {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (Number(post.userId) !== Number(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete this post'
            });
        }

        await post.destroy();

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// 3- Retrieve all posts with details
async function getPostDetails(req, res) {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'title'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                },
                {
                    model: Comment,
                    as: 'comments',
                    attributes: ['id', 'content']
                }
            ]
        });

        return res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// 4- Retrieve all posts with comment count number

async function getPostCommentCount(req, res) {
    try {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'title',
                [
                    require('sequelize').fn(
                        'COUNT',
                        require('sequelize').col('comments.id')
                    ),
                    'commentCount'
                ]
            ],
            include: [
                {
                    model: Comment,
                    as: 'comments',
                    attributes: []
                }
            ],
            group: ['Post.id']
        });

        return res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
module.exports = {
    createPost,
    deletePost,
    getPostDetails,
    getPostCommentCount
};