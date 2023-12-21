const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/all', async(req, res) => {
    try {
        const allUsers = await User.find({});
        res.json(allUsers);
    } catch (error) {
        console.error('Error fetching all user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json({
            userId: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            dob: user.dob,
            mobile: user.mobile
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/profile/:userId', async(req, res) => {
    try {
        const { age, gender, dob, mobile } = req.body;
        const userId = req.params.userId;

        const updatedUser = await User.findByIdAndUpdate(
            userId, { age, gender, dob, mobile }, { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;