'use strict';
const express = require('express');
const router = express.Router();

// モデルの読み込み
const Status = require('../models/aaastatuses');
const UserStatus = require('../models/userStatus');

// '~/' にGETアクセスが来たときの処理
router.get('/', function(req, res, next){
  Status.findAll(
  ).then(status=>{
    UserStatus.findAll({
      where:{
        user_id: req.user_id
      }
    }).then(userStatus=>{
      res.render('index', {
        title: 'fuwapath',
        user: req.user,
        status: status,
        userStatus: userStatus
      });
    });
  });
});

module.exports = router;
