'use strict';
const express = require('express');
const router = express.Router();

// パッケージの読み込み
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// モデルの読み込み
const UserTmp = require('../models/userTmp');

// メール送信設定
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS
  }
});
const mailOptions = {
  from: 'fuwafuwa info <marimo.9863@gmail.com>',
  subject: 'fuwafuwaアカウントの確認'
};

// '~/signup'にGETアクセスが来たときの処理
router.get('/', function(req, res, next){
  res.render('signup', { title: 'Sign up | fuwafuwa' });
});

// '~/signup'にPOSTアクセスが来たときの処理
router.post('/', function(req, res, next){
  const email = req.body.email;
  const username = req.body.username;
  const password = hashing(req.body.password);
  const token = crypto.randomBytes(16).toString('hex');
  const hashedToken = hashing(token);
  UserTmp.upsert({
    email: email,
    username: username,
    password: password,
    token: hashedToken
  }).then(() => {
    mailOptions.to = email;
    mailOptions.html = '<p>以下のリンクからアカウントの確認を行ってください｡</p><br><a href="localhost:8000/auth/email/' + token + '">アカウントを確認</a>';
    transporter.sendMail(mailOptions, (err, info) => {
      if (err){
        console.log(err);
      } else {
        console.log('Message sent: ' + info.accepted);
        res.render('signup', { title: 'アカウントの確認 | fuwafuwa' });
      }
    });
  });
});

// ハッシュ化関数
function hashing(data){
  const shasum = crypto.createHash('sha1');
  shasum.update(data);
  let hash = shasum.digest('hex');
  return hash;
}

module.exports = router;
