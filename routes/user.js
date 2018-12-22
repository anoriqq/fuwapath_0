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

// '~/user/status' にPUTアクセスが来たときの処理
router.put('/status', authenticationEnsurer, function(req, res, next){
  const statusCode = crypto.randomBytes(8).toString('hex');
  UserStatus.create({
    status_code: statusCode,
    user_id: req.user.user_id,
    status_name: req.body.statusName
  }).then(()=>{
    res.end();
  });
});

// '~/user/common-status' にPUTアクセスが来たときの処理
router.put('/common-status', authenticationEnsurer, function(req, res, next){
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

// '/user/common-status' にGETアクセスが来たときの処理
router.get('/common-status', authenticationEnsurer, function(req, res, next){
  Status.findAll().then(status=>{
    res.send(status);
  });
});

// '/common-status/delete' にGETアクセスが来たときの処理
router.post('/common-status/delete', authenticationEnsurer, function(req, res, next){
  const statusCode = req.body.statusCode;
  console.log(statusCode);
  Status.destroy({
    where:{
      status_code: statusCode
    }
  }).then(()=>{
    res.end();
  });
});

module.exports = router;
