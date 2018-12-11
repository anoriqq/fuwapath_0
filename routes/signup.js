'use strict';
const express = require('express');
const router = express.Router();

// モジュールの読み込み
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// モデルの読み込み
const UserTmp = require('../models/userTmp');

// メール送信設定
const transporter = nodemailer.createTransport(smtpTransport({
  host: 'smtp.lolipop.jp',
  port: 587,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS
  }
}));
const params = {
  from: 'fuwapath info < ' + process.env.EMAIL_ADDRESS + '>',
  subject: 'fuwapathアカウントの確認'
};

// '~/signup'にGETアクセスが来たときの処理
router.get('/', function(req, res, next){
  res.render('signup', { title: 'Sign up | fuwapath' });
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
    params.to = email;
    params.html = '<p>以下のリンクからアカウントの確認を行ってください｡</p><br><a href="localhost:8000/auth/email/' + token + '">アカウントを確認</a>';
    transporter.sendMail(params, (err, info) => {
      if (err){
        console.log(err);
      } else {
        console.log('Message sent: ' + info.accepted);
        res.render('signup', { title: 'アカウントの確認 | fuwapath' });
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
