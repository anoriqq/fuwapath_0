'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./_authentication-ensurer');
const Event = require('../models/event');

router.post('/', authenticationEnsurer, (req, res, next)=>{
  const userId = req.user.user.id;
  const timestamp = new Date();
  let statusCode = req.body.statusCode;
  const statusSub = req.body.statusSub;
  statusCode = Number(statusSub)*100+Number(statusCode);
  Event.upsert({
    userId: userId,
    timestamp: timestamp,
    statusCode: statusCode
  }).then(()=>{
    res.json({status:'OK'});
  });
});

module.exports = router;
