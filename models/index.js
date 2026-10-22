const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

// User and Post
User.hasMany(Post, {
    foreignKey: 'userId',
    as: 'posts'
});

Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User and Comment
User.hasMany(Comment, {
    foreignKey: 'userId',
    as: 'comments'
});

Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Post and Comment
Post.hasMany(Comment, {
    foreignKey: 'postId',
    as: 'comments'
});

Comment.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post'
});

module.exports = {
    User,
    Post,
    Comment
};