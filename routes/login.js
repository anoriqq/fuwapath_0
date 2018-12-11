'use strict';
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
  res.render('login', {title: 'ログイン | fuwapath', user: req.user});
});

module.exports = router;
