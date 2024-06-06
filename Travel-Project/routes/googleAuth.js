const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken');
require("dotenv").config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const GoogleUserData=require("../models/googleUserData")

const passport = require('passport')
let GoogleStrategy = require('passport-google-oauth20').Strategy;

router.use(session({
    secret: 'googlesecretkey', // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: true
}));

// Add Passport.js middleware after express-session
router.use(passport.initialize());
router.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:4444/oauth",
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, cb) {
        console.log("Request path:", req.path);
        try {
            // console.log(profile, "google data")
            let existedUser;
            existedUser = await GoogleUserData.findOne({ googleId: profile.id });
            if (existedUser) {
                console.log('existing');
            }
            if (!existedUser) {
                console.log('not existed and creted document');
                const userData = {
                    googleId: profile.id,
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                };
                existedUser = await GoogleUserData.create(userData);
            }
            cb(null, profile);

        } catch (error) {
            // If an error occurs, pass the error to the callback function
            cb(error);
        }
    }
));

// Configure Passport.js to use session support
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

router.get('/userdata/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/oauth', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
    async function (req, res) {
        console.log("Request path:", req.path);
            let existedUser = await GoogleUserData.findOne({ googleId: req.user.id });
            console.log(existedUser)
            if (!existedUser) {
                return res.status(404).json({ message: 'google user not found' });
            }
            const userData = {
                user: {
                    id: existedUser._id
                }
            };
            // Generate JWT token 
            const token = jwt.sign(userData, process.env.JWT_USER_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
            console.log("token :", token)
            // Send the token in the Authorization header
            res.set('Authorization', `Bearer ${token}`);
            res.redirect(`http://localhost:3000/login?token=${token}`);
    });




module.exports = router;
