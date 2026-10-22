const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'assignment5_sequelize',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;