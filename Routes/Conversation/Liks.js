var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/REST/Liks';

//?dateTime=das
router.post('/:prjId', function(req, res) {
   var vld = req.validator;
   var prjId = req.params.prjId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      if (vld.isEmpty(req.body, cb))
         cnn.chkQry('select * from Likes where prjId = ? and prsId = ?',
          [prjId, req.session.id], cb);
   },
   function(result, fields, cb) {
      if (result.length > 0)
         cb();
      else
         cnn.chkQry('insert into Likes set ?', {prjId, prsId: req.session.id},
          cb);
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }

      cnn.release();
   });
});

router.delete('/:prjId', function(req, res){
   var cnn = req.cnn;
   var prjId = parseInt(req.params.prjId, 10);

   async.waterfall([
   function(cb) {
      cnn.chkQry('delete from Likes where prjId = ? and prsId = ?',
       [prjId, req.session.id], cb);
   }],
   function(err) {
      res.status(200).end();
      cnn.release();
   });
});

router.get('/:prjId', function(req, res) {
   var cnn = req.cnn;
   var prjId = parseInt(req.params.prjId, 10);

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Likes where prjId = ? and prsId = ?',
       [prjId, req.session.id], cb);
   },
   function(result, fields, cb) {
      res.json(result);
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

module.exports = router