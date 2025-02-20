import { Router } from "express";
import * as controller from "../../controllers/clients/login.controller";
import * as validate from "../../validates/clients/login.validate";
import passport from "../../middlewares/clients/login.middleares";
import * as middlewareCart from "../../middlewares/clients/session_cart.middlewares";
const router: Router = Router();


router.get("/",validate.getLogin, controller.index);
router.post("/",validate.postLogin, controller.login_verify);

//Google
// router.get("auth/google", passport.a);
router.get('/auth/google',
    (req:any, res:any, next) => {
        if (req.query) {

            req.session['queryBackUp'] = req.query; // Lưu vào session
    
        }
        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback từ Google
router.get('/auth/google/callback',
    
    (req:any, res:any, next) => {
        console.log("ok")
        const reqSession = req.session['queryBackUp'];
        if(reqSession) {
            req['queryBackup'] = reqSession;
        }
        next();
        },
    passport.authenticate('google', { failureRedirect: '/login' }),

   validate.postLoginGoogle, controller.login_google);


// Route Facebook Login
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/auth/facebook/callback',
    (req, res, next) => {
        const query = req.query;
        const {error_message, error_code} = query;

        if (error_message) {
            req.flash('error', error_message.toString());
            res.redirect('/login');
            return;
        }
        next();
    },
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    validate.postLoginFacebook, controller.login_facebook
);
export const loginRoutes: Router = router;
