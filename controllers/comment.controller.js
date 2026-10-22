const { Op } = require('sequelize');
// comment APIS >> bulk create
const { User, Post, Comment } = require('../models');

async function createBulkComments(req, res) {
    try {
        const { comments } = req.body;

        if (!Array.isArray(comments) || comments.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comments must be a non-empty array'
            });
        }

        const createdComments = await Comment.bulkCreate(comments, {
            validate: true
        });

        return res.status(201).json({
            success: true,
            data: createdComments
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

//           2-
async function updateComment(req, res) {
    try {
        const { commentId } = req.params;
        const { userId, content } = req.body;

        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        if (Number(comment.userId) !== Number(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to update this comment'
            });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

//                   3-
async function findOrCreateComment(req, res) {
    try {
        const { postId, userId, content } = req.body;

        const [comment, created] = await Comment.findOrCreate({
            where: {
                postId,
                userId,
                content
            },
            defaults: {
                postId,
                userId,
                content
            }
        });

        return res.status(created ? 201 : 200).json({
            success: true,
            created,
            data: comment
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

//                  4-
async function searchComments(req, res) {
    try {
        const { word } = req.query;

        if (!word) {
            return res.status(400).json({
                success: false,
                message: 'Search word is required'
            });
        }

        const comments = await Comment.findAll({
            where: {
                content: {
                    [require('sequelize').Op.like]:' %${word}%'
    }
    }
    });

        const count = await Comment.count({
            where: {
                content: {
                    [require('sequelize').Op.like]: '%${word}%'
    }
    }
    });

        return res.status(200).json({
            success: true,
            count,
            data: comments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
//                     5 -

async function getNewestComments(req, res) {
    try {
        const { postId } = req.params;

        const comments = await Comment.findAll({
            where: { postId },
            order: [['createdAt', 'DESC']],
            limit: 3
        });

        return res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//                           6-

async function getCommentDetails(req, res) {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Post,
                    as: 'post',
                    attributes: ['id', 'title', 'content']
                }
            ]
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createBulkComments,
    updateComment,
    findOrCreateComment,
    searchComments,
    getNewestComments,
    getCommentDetails
};