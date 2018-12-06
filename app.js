require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');

// モデルの読み込み
const User = require('./models/user');
const Event = require('./models/event');
const UserAuth = require('./models/userAuth');
const UserStatus = require('./models/userStatus');
const Status = require('./models/Statuses');
User.sync().then(()=>{
  UserAuth.belongsTo(User, {foreignKey: 'user_id'});
  UserAuth.sync();
  UserStatus.belongsTo(User, {foreignKey: 'user_id'});
  UserStatus.sync();
  Event.belongsTo(User, {foreignKey: 'user_id'});
  Event.sync();
  Status.sync().then(()=>{
    Event.belongsTo(Status, {foreignKey: 'status_code'});
    Event.sync();
    UserStatus.belongsTo(Status, {foreignKey: 'status_code'});
    UserStatus.sync();
  });
});

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
    User.upsert({
      user_id: profile.id,
      user_name: profile.user.name,
      team_id: profile.team.id,
      team_name: profile.team.name
    }).then(()=>{
      done(null, profile);
    });
  });
}
));

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const logoutRouter = require('./routes/logout');
const eventRouter = require('./routes/event');
const signupRouter = require('./routes/signup');

const app = express();
app.use(helmet());

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
app.use('/user', userRouter);
app.use('/logout', logoutRouter);
app.use('/event', eventRouter);
app.use('/signup', signupRouter);

app.get('/auth/slack', passport.authenticate('Slack'));
app.get('/auth/slack/callback', passport.authenticate('Slack', {failureRedirect: '/index'}), (req, res)=>res.redirect('/'));

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
