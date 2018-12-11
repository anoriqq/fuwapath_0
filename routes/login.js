'use strict';
const express = require('express');
const router = express.Router();

// モジュールの読み込み
const passport = require('passport');

// ~/login にGETアクセスが来たときの処理
router.get('/', function(req, res, next){
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
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
