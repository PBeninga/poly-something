var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/REST/Msgs';

router.get('/:msgId', function(req, res) {
   var vld = req.validator;
   var query = 'select whenMade, email, content from ' +
    'Message m join Person p on m.prsId = p.id where m.id = ?';
    async.waterfall([
      function(cb) {
         req.cnn.chkQry(query, [req.params.msgId], cb);
      },
      function(cnvs, fields, cb) {
         if(vld.check(cnvs.length !== 0, Tags.notFound, null, cb)){
            res.json(cnvs[0])
            res.status(200).end()
            cb()
         }
      }],
      function(err) {
         req.cnn.release();
      });
});
module.exports = router