var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

var kMaxTitleLen = 80;
router.baseURL = '/Cnvs';
//?owner=id
router.get('/', function(req, res) {
   cb = function(err, cnvs) {
      if (!err)
         res.json(cnvs);
      req.cnn.release();
   }
   if(!req.query.owner){
      req.cnn.chkQry('select id, title, ownerId, lastMessage from Conversation'
                     , null, cb);
   }else{
      req.cnn.chkQry('select id, title, ownerId, lastMessage from '
                     + 'Conversation where ownerId = ?', req.query.owner, cb);
   }
});
router.get('/:id', function(req, res) {
   var vld = req.validator;
   cb = function(err, cnvs) {
      if (!err && vld.check(cnvs.length, Tags.notFound, null, null))
         res.json(cnvs[0]).status(200).send();
      req.cnn.release();
   }
   req.cnn.chkQry('select id, title, ownerId, lastMessage from '+
                  'Conversation where id = ?', req.params.id, cb);
});


router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   body.ownerId = req.session.id
   async.waterfall([
   function(cb) {
      if(vld.check(req.body.title, Tags.missingField, ["title"], cb) &&
         vld.check(req.body.title.length <= kMaxTitleLen, Tags.badValue,
                   ["title"], cb))
      cnn.chkQry('select * from Conversation where title = ?', 
                  [body.title], cb);
   },
   function(existingCnv, fields, cb) {
      if (vld.check(!existingCnv.length, Tags.dupTitle, null, cb))
         cnn.chkQry("insert into Conversation set ?", [body], cb);
   },
   function(insRes, fields, cb) {
      res.status(200).location(router.baseURL +"/"+insRes.insertId).end();
      cb();
   }],
   function(err) {
      if(err){
         res.status(500).end()
      }
      cnn.release();
   });
});

router.put('/:cnvId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;

   async.waterfall([
   function(cb) {
      if(vld.check(body.title, Tags.missingField, ["title"], cb) &&
         vld.check(body.title.length <= kMaxTitleLen , Tags.badValue, 
                  ["title"], cb))
         cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },
   function(cnvs, fields, cb) {
      console.log(cnvs)
      if (vld.check(cnvs.length, Tags.notFound, null, cb) && 
          vld.checkPrsOK(cnvs[0].ownerId, cb))
         cnn.chkQry('select * from Conversation where id <> ? && title = ?',
          [cnvId, body.title], cb);
   },
   function(sameTtl, fields, cb) {
      if (vld.check(!sameTtl.length, Tags.dupTitle, null, cb))
         cnn.chkQry("update Conversation set title = ? where id = ?",
          [body.title, cnvId], cb);
   }],
   function(err) {
      if (!err)
         res.status(200).end();
      cnn.release();
   });
});

router.delete('/:cnvId', function(req, res) {
   var vld = req.validator;
   var cnvId = req.params.cnvId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },
   function(cnvs, fields, cb) {
      if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
       vld.checkPrsOK(cnvs[0].ownerId, cb))
         cnn.chkQry('delete from Conversation where id = ?', [cnvId], cb);
   }],
   function(err) {
      if (!err)
         res.status(200).end();
      cnn.release();
   });
});

//?dateTime=das&num=num
router.get('/:cnvId/Msgs', function(req, res) {
   var vld = req.validator;
   var cnvId = req.params.cnvId;
   var cnn = req.cnn;
   var whenMade  = new Date().getTime()
   if(req.query.dateTime && isFinite(req.query.dateTime)){
      whenMade = req.query.dateTime
   }
   var query = 'select m.whenMade, email, content, m.id from Conversation c' +
               ' join Message m on m.cnvId = c.id join Person p on prsId ='+ 
               ' p.id where c.id = ? ' +
               'and m.whenMade <= ? order by whenMade, m.id asc';
   var params = [cnvId, whenMade];
   req.query.num = parseInt(req.query.num)
   console.log(req.query.num )
   // And finally add a limit clause and parameter if indicated.
   if (!isNaN(req.query.num) && req.query.num !== undefined) {
      query += ' limit ?';
      params.push(req.query.num);
   }

   async.waterfall([
   function(cb) {  // Check for existence of conversation
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },
   function(cnvs, fields, cb) { // Get indicated messages
      if (vld.check(cnvs.length, Tags.notFound, null, cb))
         cnn.chkQry(query, params, cb);
   },
   function(msgs, fields, cb) { // Return retrieved messages
      res.json(msgs);
      cb();
   }],
   function(err){
      cnn.release();
   });
});

router.post('/:cnvId/Msgs', function(req, res){
   var vld = req.validator;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;
   var now;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
   },
   function(cnvs, fields, cb) {
      if (vld.check(req.body.content, Tags.missingField, ["content"],cb) && 
          vld.chain(cnvs.length, Tags.notFound, null).
              check(req.body.content.length <= 5000, Tags.badValue, null, cb))
         cnn.chkQry('insert into Message set ?',
          {cnvId: cnvId, prsId: req.session.id,
          whenMade: now = new Date().getTime(), content: req.body.content},
           cb);
   },
   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' +cnvId+'/'+ insRes.insertId).end();
      cnn.chkQry("update Conversation set lastMessage = ? where id = ?",
       [now, cnvId], cb);
   }],
   function(err) {
      cnn.release();
   });
});

module.exports = router;
