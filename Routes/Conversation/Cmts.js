var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/REST/Cmts';

//?dateTime=das
router.get('/:prjId', function(req, res) {
   var vld = req.validator;
   var prjId = req.params.prjId;
   var cnn = req.cnn;
   var whenMade  = new Date().getTime();

   if (req.query.dateTime && isFinite(req.query.dateTime)) {
      whenMade = req.query.dateTime
   }

   var query = 'select c.whenMade, email, c.content, c.id from Project prj' +
               ' join Comment c on c.prjId = prj.id join Person p on prsId ='+ 
               ' p.id where prj.id = ? ' +
               'and c.whenMade <= ? order by c.whenMade desc, c.id desc';
   var params = [prjId, whenMade];

   async.waterfall([
   function(cb) {  // Check for existence of project 
      cnn.chkQry('select * from Project where id = ?', [prjId], cb);
   },
   function(prjs, fields, cb) { // Get indicated comments 
      if (vld.check(prjs.length, Tags.notFound, null, cb))
         cnn.chkQry(query, params, cb);
   },
   function(cmts, fields, cb) { // Return retrieved comments
      res.json(cmts);
      cb();
   }],
   function(err){
      cnn.release();
   });
});

router.post('/:prjId', function(req, res){
   var vld = req.validator;
   var cnn = req.cnn;
   var prjId = req.params.prjId;
   var now;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Project where id = ?', [prjId], cb);
   },
   function(prjs, fields, cb) {
      if (vld.check(req.body.content, Tags.missingField, ["content"], cb) && 
          vld.chain(prjs.length, Tags.notFound, null).
              check(req.body.content.length <= 5000, Tags.badValue, null, cb))
         cnn.chkQry('insert into Comment set ?',
          {prjId: prjId, prsId: req.session.id,
          whenMade: now = new Date().getTime(), content: req.body.content},
           cb);
   }],
   function(err) {
      res.status(200).end();
      cnn.release();
   });
});

module.exports = router