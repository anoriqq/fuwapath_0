'use strict';
const express = require('express');
const router = express.Router();

// モジュールの読み込み
const authenticationEnsurer = require('./_authentication-ensurer');

// ~/user にGETアクセスが来たときの処理
router.get('/', authenticationEnsurer, function(req, res, next){
  res.render('user', {
    title: 'ユーザーページ | fuwapath',
    user: req.user
  });
});

module.exports = router;
