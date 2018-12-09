require('dotenv').config();

// パッケージの読み込み
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
const UserTmp = require('./models/userTmp');
const Status = require('./models/Statuses');

// ルーター読み込み
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const logoutRouter = require('./routes/logout');
const eventRouter = require('./routes/event');
const signupRouter = require('./routes/signup');
const authRouter = require('./routes/auth');
const loginRouter = require('./routes/login');

// パスポートのストラテジー作成
const LocalStrategy = require('passport-local').Strategy;

// アプリケーション作成
const app = express();

// モデルのリレーション設定
User.sync().then(() => {
  UserAuth.belongsTo(User, { foreignKey: 'user_id' });
  UserAuth.sync();
  UserStatus.belongsTo(User, { foreignKey: 'user_id' });
  UserStatus.sync();
  Event.belongsTo(User, { foreignKey: 'user_id' });
  Event.sync();
  Status.sync().then(() => {
    Event.belongsTo(Status, { foreignKey: 'status_code' });
    Event.sync();
    UserStatus.belongsTo(Status, { foreignKey: 'status_code' });
    UserStatus.sync();
    UserTmp.sync();
  });
});

// セッション
passport.serializeUser(function(user, done){
  done(null, user.user_id);
});
passport.deserializeUser(function(userId, done){
  UserAuth.findOne({where:{user_id:userId}}).then((user)=>{
    done(null, user);
  });
});

// ユーザー認証
passport.use(new LocalStrategy(
  function(username, password, done){
    UserAuth.findOne({
      where:{username: username}
    }).then(user=>{
      if (!user){
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password){
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).catch(err=>{
      return done(err, false);
    });
  }
));

// view設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// アプリケーション設定
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// ルート設定
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/logout', logoutRouter);
app.use('/event', eventRouter);
app.use('/signup', signupRouter);
app.use('/auth', authRouter);
app.use('/login', loginRouter);
app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res, next)=>res.redirect('/'));

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
