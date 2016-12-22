// npm install --save express mongoose connect-flash cookie-parser body-parser express-session ejs passport passport-loc
// al bcrypt-nodejs morgan
const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const configDB = require('./config/database');
const passport = require('passport');
const Flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const User = require('./modules/user.js');

// Config
mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser()); // read cookies
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); //set up ejs for templating

app.use(session({
  secret: 'caleo',
  resave: true,
  saveUninitialezed: true
}));

app.use(passport.initialize());
app.use(passport.session()); // presistence
app.use(Flash());

// routes
require('./app/routes')(app, passport);

app.listen(PORT, ()=>{
  console.log('The app is alive at PORT: '+ PORT);
});
