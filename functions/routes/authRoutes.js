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
        const accessToken = generateToken(req?.user);

        res.cookie("auth_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None" 
          });
          
      
        res.redirect(`${process.env.UI_URL}`);
    }
);



module.exports = router;
