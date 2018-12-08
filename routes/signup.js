'use strict';
const express = require('express');
const router = express.Router();

// パッケージの読み込み
const crypto = require('crypto');
const uuid = require('uuid');
const nodemailer = require('nodemailer');

// モデルの読み込み
const User = require('../models/user');
const UserAuth = require('../models/userAuth');

// メール送信設定
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS
  }
});

// '~/signup'にGETアクセスが来たときの処理
router.get('/', function(req, res, next){
  res.render('signup', { title: 'Sign up | fuwafuwa' });
});

// '~/signup'にPOSTアクセスが来たときの処理
router.post('/', function(req, res, next){
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const userId = uuid.v4();
  const token = crypto.randomBytes(16).toString('hex');
  User.create({
    user_id: userId,
    username: userName,
    token: token
  }).then(() => {
    UserAuth.create({
      username: userName,
      user_id: userId,
      password: password,
      email: email
    }).then(() => {
      const mailOptions = {
        from: 'fuwafuwa info <marimo.9863@gmail.com>',
        to: req.body.email,
        subject: 'fuwafuwaアカウントの確認',
        html:
            '<p>以下のリンクからアカウントの確認を行ってください｡</p><br><a href="localhost:8000/auth/email/' + token + '">アカウントを確認</a>'
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err){
          console.log(err);
        } else {
          console.log('Message sent: ' + info.accepted);
          res.render('signup', { title: 'Sign up | fuwafuwa', user: req.user, data:req.body });
        }
      });
    });
  });
});

module.exports = router;
