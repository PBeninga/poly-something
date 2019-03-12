var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

var kMaxTitleLen = 80;
router.baseURL = '/Prjs';

// optional params timePosted and category
router.get('/', function(req, res) {
   var query = 'select id, title, ownerId, content, category, count(prsId) as ' +
    'numLikes from Project left join (select prjId, count(prsId) from Like ' +
    'group by prjId) on id = prjId where timePosted >= ?';
   var params = [];

   if (req.params.timePosted) 
      params.push(parseInt(req.params.timePosted));
   else
      params.push(0);
   
   if(req.params.category && req.params.category.length) {
      query += ' and category = ?';
      params.push(req.params.category);
   }

   async.waterfall([
   function(cb) {
      req.cnn.chkQry(query, params, cb);
   },
   function(prjArr, cb) {
      res.json(prjArr);
      cb();
   }],
   function(err) {
      if (err) {
         res.status(500).end()
      }
      cnn.release();
   });
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   cb = function(err, prjs) {
      if (!err && vld.check(prjs.length, Tags.notFound, null, null))
         res.json(prjs[0]).status(200).send();
      req.cnn.release();
   }

   async.waterfall([
   function(cb) {
      req.cnn.chkQry('select id, title, ownerId, category, content from ' +
       'Project where id = ?', [req.params.id], cb);
   },
   function(prjs, fields, cb) { // count might return table still, I treat it as int
      if (vld.check(prjs.length, Tags.notFound, null, cb)) {
         req.cnn.chkQry('select count(prjId) from Like where prjId = ?',
          [req.params.id],
          function(err, numLikes, fields) {
            prjs[0].numLikes = numLikes;
            cb(err, prjs[0], fields);
          });
      }
   },
   function(prj, fields, cb) {
      res.json(prj);
      cb();
   }],
   function(err) {
      if(err) {
         res.status(500).end();
      }
      cnn.release();
   })
});


router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   body.ownerId = req.session.id;

   async.waterfall([
   function(cb) {
      if (vld.hasFields(body, ["title", "content", "thumbnail"], cb) &&
       vld.chain(req.body.title.length <= kMaxTitleLen, Tags.badValue,
       ["title"], cb)
       .chain(req.body.content.length <= kMaxContentLen, Tags.badValue,
       ["content"], cb)
       .check(req.session, Tags.noLogin, null, cb)) {
         cnn.chkQry('insert into Project set ?', body, cb);
      }
   },
   function(insRes, fields, cb) {
      res.status(200).location(router.baseURL + "/" + insRes.insertId).end();
      cb();
   }],
   function(err) {
      if(err){
         res.status(500).end()
      }
      cnn.release();
   });
});

router.put('/:prjId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var prjId = req.params.prjId;

   async.waterfall([
   function(cb) {
      if (vld.chain(!body.title || body.title.length <= kMaxTitleLen,
       Tags.badValue, ["title"], cb)
       .chain(!body.content || body.content.length <= kMaxContentLen,
       Tags.badValue, ["content"], cb))
         cnn.chkQry('select * from Project where id = ?', [prjId], cb);
   },
   function(prjs, fields, cb) {
      if (vld.check(prjs.length, Tags.notFound, null, cb) && 
       vld.checkPrsOK(prjs[0].ownerId, cb))
         cnn.chkQry('update Project set title = ?, content = ?, ' +
          'thumbnail = ?, contributors = ? where id = ?',
          [body.title || prjs[0].title, body.content || prjs[0].content,
          body.thumbnail || prjs[0].thumbnail,
          body.contributors || prjs[0].contributors, prjId], cb);
   }],
   function(err) {
      if (!err)
         res.status(200).end();
      cnn.release();
   });
});

router.delete('/:prjId', function(req, res) {
   var vld = req.validator;
   var prjId = req.params.prjId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Project where id = ?', [prjId], cb);
   },
   function(prjs, fields, cb) {
      if (vld.check(prjs.length, Tags.notFound, null, cb) &&
       vld.checkPrsOK(prjs[0].ownerId, cb))
         cnn.chkQry('delete from Project where id = ?', [prjId], cb);
   }],
   function(err) {
      if (!err)
         res.status(200).end();
      cnn.release();
   });
});

module.exports = router;
