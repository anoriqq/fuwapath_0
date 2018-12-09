'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./_authentication-ensurer');
const Event = require('../models/event');
const Statuses = require('../models/statuses');
const moment = require('moment-timezone');

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

router.get('/get', authenticationEnsurer, (req, res, next)=>{
  Event.findAll({
    include:[{
      model: Statuses,
      attributes: ['status_code', 'status_name']
    }],
    where:{
      user_id: req.user.user_id
    },
    order:[['"timestamp"', 'DESC']]
  }).then((data)=>{
    for(let i=0;i<data.length;i++){
      data[i].dataValues.timestamp = moment.tz(data[i].createdAt, 'Asia/Tokyo').format();
    }
    res.json(data);
  });
});

module.exports = router;
