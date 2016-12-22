module.exports = function(app, passport){
  // Show the home page
  app.get('/', (req, res)=>{
    res.render('index.ejs');
  });

  app.get('/profile', (req,res)=>{
    res.render('profile.ejs', {
      user: req.user
    });
  });

  // Local strategy
  app.get('/login', (req, res)=>{
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });

  // Signup
  // show the form
  app.get('/signup', (req, res)=>{
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });


  // signem up
  app.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));
}
