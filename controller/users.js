const User = require('../models/user.js');

module.exports.signupForm = (req, res) =>{
    res.render('users/signup.ejs')
};

module.exports.signup = async(req, res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (error) =>{
            if(error){
                return next(error);
            }
            req.flash('success', 'Welcome to WandorWorld!!');
            res.redirect('/listings');
        })
    } catch(error){
        req.flash('error', error.message);
        res.redirect('/signup');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async(req, res) => {
    req.flash('success' ,'Welcome to WandorWorld! You are successfully logged-in');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((error) =>{
        if(error) {
            return next(error);
        }
        req.flash('success', 'Logged Out!!');
        res.redirect('/listings');
    });
};