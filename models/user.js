const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            checkPasswordLength(value) {
                if (value.length <= 6) {
                    throw new Error('Password must be longer than 6 characters');
                }
            }
        }
    },

    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
        tableName: 'users',
        hooks: {
            beforeCreate(user) {
                if (!user.name || user.name.length <= 2) {
                    throw new Error('Name must be longer than 2 characters');
                }
            }
        }
    }
 );

// validation method for the name
User.prototype.checkNameLength = function () {
    if (!this.name || this.name.length <= 2) {
        throw new Error('Name must be longer than 2 characters');
    }
};

module.exports = User;
