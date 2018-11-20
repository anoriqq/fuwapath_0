'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./_authentication-ensurer');
const Event = require('../models/event');
const Statuses = require('../models/Statuses');

/* GET user listing. */
router.get('/', authenticationEnsurer, function(req, res, next){
  Event.findAll({
    include:[{
      model: Statuses,
      attributes: ['status_code', 'status_name']
    }],
    where:{
      user_id: req.user.user.id
    },
    order: [['"event_id"', 'DESC']]
  }).then((events)=>{
    res.render('user', {
      title: 'ユーザーページ',
      user: req.user,
      events: events
    });
  });
});

module.exports = router;
