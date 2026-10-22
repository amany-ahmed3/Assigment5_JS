/*

const express = require('express');
const sequelize = require('./config/database');
const { User, Post, Comment } = require('./models');

const app = express();

app.use(express.json());

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync();
        console.log('Models synchronized successfully');

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    } catch (error) {
        console.error('Startup error:', error.message);
    }
}

startServer();
*/

// part2:ApIs

const express = require('express');
const sequelize = require('./config/database');

require('./models');

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync();
        console.log('Models synchronized successfully');

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    } catch (error) {
        console.error('Startup error:', error.message);
    }
}

startServer().catch(console.error);
