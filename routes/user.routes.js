const express = require('express');
const router = express.Router();

const {
    signup,
    createOrUpdateUser,
    getUserByEmail,
    getUserById
} = require('../controllers/user.controller');

router.post('/signup', signup);
router.put('/:id', createOrUpdateUser);
router.get('/by-email', getUserByEmail);
router.get('/:id', getUserById);

module.exports = router;