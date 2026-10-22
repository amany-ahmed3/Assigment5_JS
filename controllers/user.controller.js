const { User } = require('../models');

// 1- Create a new user post/users/signup

async function signup(req, res) {
    try {
        const { name, email, password, role } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Build a new user instance
        const user = User.build({
            name,
            email,
            password,
            role
        });

        // Save the user after validation
        await user.save();

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors
                    ? error.errors.map(item => item.message)
                    : [error.message]
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}



// 2- create or update >> put/users/:id

async function createOrUpdateUser(req, res) {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const [user, created] = await User.upsert(
            {
                id: Number(id),
                name,
                email,
                password,
                role
            },
            {
                validate: false,
                returning: true
            }
        );

        return res.status(created ? 201 : 200).json({
            success: true,
            message: created ? 'User created successfully' : 'User updated successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// 3- Get user by email

async function getUserByEmail(req, res) {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// 4- Get user by ID

async function getUserById(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: {
                exclude: ['role', 'password']
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    signup,
    createOrUpdateUser,
    getUserByEmail,
    getUserById
};