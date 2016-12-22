const LocalStrategy = require('passport-local').Strategy;

// Load the user model
const User = require('../app/models/user');

module.exports = function (passport) {
    // serialize the user for session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize User
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // local login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done){
        if (email) {
            email = email.toLowerCase();
        }
        // Async
        process.nextTick(function (){
            User.findOne({
                'local.email': email
            }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found'));
                }
                if (!user.validPassword(password)) {
                    return done(null ,false , req.flash('loginMessage', 'Ooop! Wrong password.'));
                }
                return done(null, user);

            });
        });
    }));

    // local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done){
        if(email) {
            email = email.toLowerCase();
        }

        // Async
        process.nextTick(function(){
            if (!req.user) {
                User.findOne({
                    'local.email': email
                }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                    } else {
                        // create the user
                        const newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save((err) => {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else if (!req.user.local.email) {
                User.findOne({
                    'local-email': email
                }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                    } else {
                        const user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save((err) => {
                            if (err) {
                                return done(err);
                            }
                            return done(null, user);
                        });
                    }
                });
            } else {
                return done(null, req.user);
            }
        });

    }));
}
