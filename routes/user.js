'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./_authentication-ensurer');
const Event = require('../models/event');

/* GET user listing. */
router.get('/', authenticationEnsurer, function(req, res, next){
  // Event.findAll().then((Event)=>{
  //   res.json(JSON.stringify(Event));
  // });
  res.render('user', { title: 'ユーザーページ', user: req.user });
});

module.exports = router;
