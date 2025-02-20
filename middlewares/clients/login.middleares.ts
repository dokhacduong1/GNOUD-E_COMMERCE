import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();



// Cấu hình Passport cho Google
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID_GOOGLE,
            clientSecret: process.env.CLIENT_SECRET_GOOGLE,
            callbackURL: 'https://localhost:3000/login/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Tạo user dựa trên dữ liệu từ Google
                const user = profile._json;

                done(null, user); // Truyền user để serialize
            } catch (err) {
                console.error('Error in GoogleStrategy:', err);
                done("err", null);
            }
        }
    )
);
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.CLIENT_ID_FACEBOOK,
            clientSecret: process.env.CLIENT_SECRET_FACEBOOK,
            callbackURL: 'https://localhost:3000/login/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name'], // Yêu cầu thông tin từ Facebook
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("ok3")
                const user = profile._json;
                done(null, user); // Truyền user để serialize
            } catch (err) {
                console.error('Error in FacebookStrategy:', err);
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    try {
        console.log("ok1")
        done(null, user.sub || user.id); // Lưu ID người dùng vào session
    } catch (err) {
        console.error('Error in serializeUser:', err);
        done("err1", null);
    }
});
passport.deserializeUser((user, done) => {
    try {

        done(null, user); // Trả lại thông tin người dùng từ session và gán vào `req.user`
    } catch (err) {
        console.error('Error in deserializeUser:', err);
        done("err2", null);
    }
});
export default passport;