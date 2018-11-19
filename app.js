require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const SlackStrategy = require('passport-slack-oauth2').Strategy;
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
});

passport.use(new SlackStrategy({
  clientID: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  skipUserProfile: false,
  scope: ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team']
},
(accessToken, refreshToken, profile, done)=>{
  process.nextTick(function(){
    return done(null, profile);
  });
}
));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.get('/auth/slack', passport.authenticate('Slack'));
app.get('/auth/slack/callback', passport.authenticate('Slack', {failureRedirect: '/login'}), (req, res)=>res.redirect('/'));

// catch 404 and forward to error handler
app.use(function(req, res, next){
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next){
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
