var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/cmts';

//?dateTime=das
router.get('/:prjId', function(req, res) {
   var vld = req.validator;
   var prjId = req.params.prjId;
   var cnn = req.cnn;
   var whenMade  = new Date().getTime();

   if (req.query.dateTime && isFinite(req.query.dateTime)) {
      whenMade = req.query.dateTime
   }

   var query = 'select c.whenMade, email, content, c.id from Project prj' +
               ' join Comment c on c.prjId = prj.id join Person p on prsId ='+ 
               ' p.id where prj.id = ? ' +
               'and c.whenMade <= ? order by whenMade, c.id asc';
   var params = [prjId, whenMade];

   async.waterfall([
   function(cb) {  // Check for existence of project 
      cnn.chkQry('select * from Project where id = ?', [prjId], cb);
   },
   function(prjs, fields, cb) { // Get indicated comments 
      if (vld.check(prjs.length, Tags.notFound, null, cb))
         cnn.chkQry(query, params, cb);
   },
   function(cmts, fields, cb) { // Return retrieved messages
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
   },
   function(insRes, fields, cb) {
      //res.location(router.baseURL + '/' +prjId+'/'+ insRes.insertId).end();
      // TODO: Add a response location if necessary.
      cb();
      // No need for setting last message
      // cnn.chkQry("update Project set lastMessage = ? where id = ?",
      //  [now, prjId], cb);
   }],
   function(err) {
      res.status(200).end();
      cnn.release();
   });
});

// router.get('/:msgId', function(req, res) {
//    var vld = req.validator;
//    var query = 'select whenMade, email, content from ' +
//     'Message m join Person p on m.prsId = p.id where m.id = ?';
//     async.waterfall([
//       function(cb) {
//          req.cnn.chkQry(query, [req.params.msgId], cb);
//       },
//       function(cnvs, fields, cb) {
//          if(vld.check(cnvs.length !== 0, Tags.notFound, null, cb)){
//             res.json(cnvs[0])
//             res.status(200).end()
//             cb()
//          }
//       }],
//       function(err) {
//          req.cnn.release();
//       });
// });

module.exports = router