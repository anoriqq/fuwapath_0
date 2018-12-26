'use strict';
const express = require('express');
const router = express.Router();

// モジュールの読み込み
const authenticationEnsurer = require('./_authentication-ensurer');

// モデルの読み込み
const Event = require('../models/event');

// '~/event'にPOSTアクセスが来たときの処理
router.post('/', authenticationEnsurer, (req, res, next)=>{
  const userId = req.user.user.id;
  const timestamp = new Date();
  let statusCode = req.body.statusCode;
  const statusSub = req.body.statusSub;
  statusCode = Number(statusSub)*100+Number(statusCode);
  Event.upsert({
    user_id: userId,
    timestamp: timestamp,
    status_code: statusCode
  }).then(()=>{
    res.status(200).end();
  });
});

// '~/event/get'にGETアクセスが来たときの処理
router.get('/get', authenticationEnsurer, (req, res, next)=>{
  res.end();
});

module.exports = router;
