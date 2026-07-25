const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(new Error('Google account has no email'), null);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          existingUser.googleId = existingUser.googleId || profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        const name = profile.displayName || 'Unknown User';
        const [first_name, ...rest] = name.split(' ');
        const last_name = rest.join(' ') || ' '; 
        const newUser = await User.create({
          first_name: first_name || 'Google',
          last_name: last_name || 'User',
          email,
          password: null,
          googleId: profile.id
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
