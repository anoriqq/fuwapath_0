'use strict';
const express = require('express');
const router = express.Router();

// モジュールの読み込み
const authenticationEnsurer = require('./_authentication-ensurer');
const crypto = require('crypto');

// モデルの読み込み
const UserStatus = require('../models/userStatus');
const Status = require('../models/statuses');

// '~/user' にGETアクセスが来たときの処理
router.get('/', authenticationEnsurer, function(req, res, next){
  Status.findAll().then(status=>{
    res.render('user', {
      title: 'ユーザーページ | fuwapath',
      user: req.user,
      status: status
    });
  });
});

// '~/user/status' にPOSTアクセスが来たときの処理
router.put('/userstatus', authenticationEnsurer, function(req, res, next){
  const statusCode = crypto.randomBytes(8).toString('hex');
  UserStatus.create({
    status_code: statusCode,
    user_id: req.user.user_id,
    status_name: req.body.statusName
  }).then(()=>{
    res.end();
  });
});

// '~/user/setting' にPUTアクセスが来たときの処理
router.put('/status', authenticationEnsurer, function(req, res, next){
  const statusName = req.body.statusName;
  console.log(statusName);
  if(req.user.user_id === 'admin' && statusName !== ''){
    const statusCode = crypto.randomBytes(8).toString('hex');
    Status.create({
      status_code: statusCode,
      status_name: statusName
    }).then(()=>{
      res.end();
    }).catch((err)=>{
      res.end(500);
    });
  }else{
    res.end(404);
  }
});

module.exports = router;
