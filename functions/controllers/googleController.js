const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
require('dotenv').config();

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async (req, accessToken, refreshToken, profile, done) => {
        const { emails, displayName, photos } = profile;
        try {
            let user = await User.findOne({ email: emails[0].value });

            if (user) {
                if (!user.profilePicture) {
                    user.profilePicture = photos[0]?.value;
                    await user.save();
                }
                return done(null, user);
            }

            // If user not found, create a new one
            user = await User.create({
                username: displayName,
                email: emails[0].value,
                profilePicture: photos[0]?.value,
                isAuthenticated: emails[0].verified
            });

            done(null, user);
        } catch (error) {
            done(error);
        }
    }
));



module.exports = passport;
