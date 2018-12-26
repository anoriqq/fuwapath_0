'use strict';
const express = require('express');
const router = express.Router();

// モジュールの読み込み
const passport = require('passport');

// ~/login にGETアクセスが来たときの処理
router.get('/', function(req, res, next){
  const from = req.query.from;
  if(from){
    res.cookie('loginFrom', from, {expires: new Date(Date.now() + 60000)});
  }
  res.render('login', {
    title: 'ログイン | fuwapath',
    user: req.user,
    error: req.flash('error'),
    input_username: req.flash('input_username'),
    input_password: req.flash('input_password')
  });
});

// ~/login にPOSTアクセスが来たときの処理
router.post('/', (req, res, next)=>{
  const loginFrom = req.cookies.loginFrom;
  let redirectUrl = '/';
  if(loginFrom && !loginFrom.includes('http://') && !loginFrom.includes('https://')){
    res.clearCookie('loginFrom');
    redirectUrl = loginFrom;
  }
  passport.authenticate('local', {
    successRedirect: redirectUrl,
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
