var express = require('express');
var router = express.Router();

// 获取media目录
var path = require("path");
var media = path.join(__dirname, "../public/media");

/* GET home page. */

/**
 * 控制路由 
 * '/' 代表在根路径 (views/index.js)
 */
router.get('/', function(req, res, next) {
  var fs = require("fs");

  fs.readdir(media, function(err, names) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { title: 'Passionate Music', music: names });
    }
  });  
});

module.exports = router;
