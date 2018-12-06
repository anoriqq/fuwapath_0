'use strict';
const express = require('express');
const router = express.Router();

// モデルの読み込み
const User = require('../models/user');

router.get('/email/:token', function(req, res, next){
  const token = req.params.token;
  User.findOne({
    where: {
      token: token
    }
  }).then(user => {
    if (user){
      User.update(
        {
          token: null
        },
        {
          where: {
            token: token
          }
        }
      );
      res.redirect('/', 301);
    } else {
      res.render('auth', { title: '認証失敗 | fuwafuwa' });
    }
  });
});

module.exports = router;
