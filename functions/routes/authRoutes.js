const express = require('express');
const { registerUser, loginUser, logout ,} = require('../controllers/authController');
const { generateToken } = require('../utils/generateToken');
const router = express.Router();
const passport = require('passport');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);


// Google OAuth login route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.UI_URL}/user-login`, session: false }),
    (req, res) => {
        const accessToken = generateToken(req.user)
        const authToken = { accessToken };

        // Set token in a cookie
        res.cookie("auth_token", authToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
    
        res.redirect(`${process.env.UI_URL}`);
    }
);



module.exports = router;
