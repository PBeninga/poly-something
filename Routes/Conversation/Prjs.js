var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

var kMaxTitleLen = 80;
var kMaxContentLen = 10000;
var kMaxContributorsLen = 200;
var kMaxCategoryLen = 30;
router.baseURL = '/Prjs';

// optional params timePosted and category
router.get('/', function(req, res) {
   var cnn = req.cnn;
   var query = 'select id, title, thumbnail, ownerId, timePosted, category, numLikes ' +
    'from Project p left join (select prjId, count(prsId) as numLikes from Likes ' +
    'group by prjId) l on p.id = prjId where timePosted >= ?';
   var params = [];

   if (req.params.timePosted && !isNaN(req.params.timePosted)) 
      params.push(parseInt(req.params.timePosted));
   else
      params.push(0);
   
   if(req.params.category) {
      query += ' and category = ?';
      params.push(req.params.category);
   }
   query += ' order by numLikes desc'

   async.waterfall([
   function(cb) {
      req.cnn.chkQry(query, params, cb);
   },
   function(prjArr, fields, cb) {
      prjArr.forEach(prj => prj.numLikes = prj.numLikes ? prj.numLikes : 0);
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
   var cnn = req.cnn;

   cb = function(err, prjs) {
      if (!err && vld.check(prjs.length, Tags.notFound, null, null))
         res.json(prjs[0]).status(200).send();
      req.cnn.release();
   }

   async.waterfall([
   function(cb) {
      req.cnn.chkQry('select * from Project where Project.id = ?',
       [req.params.id], cb);
},
   function(prjs, fields, cb) { // count might return table still, I treat it as int
      if (vld.check(prjs.length, Tags.notFound, null, cb)) {
         req.cnn.chkQry('select count(prjId) as numLikes from Likes where prjId = ?',
          [req.params.id],
          function(err, likeEntries, fields) {
            prjs[0].numLikes = likeEntries[0].numLikes ? likeEntries[0].numLikes : 0;
            cb(err, prjs[0], fields);
          });
      }
   },
   function(prj, fields, cb) {
      res.json(prj);
      cb();
   }],
   function(err) {
      if (err) {
         res.status(500).end();
      }
      cnn.release();
   })
});

// need to handle thumbnail size

router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   body.ownerId = req.session.id;
   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noLogin, null, cb) &&
       vld.hasFields(body, ["title", "content", "thumbnail", "category"], cb) &&
       vld.chain(req.body.title.length <= kMaxTitleLen, Tags.badValue,
       ["title"], cb)
       .chain(req.body.content.length <= kMaxContentLen, Tags.badValue,
       ["content"], cb)
       .chain(!req.body.contributors || req.body.contributors.length <=
       kMaxContributorsLen, Tags.badValue, ["contributors"], cb)
       .chain(req.body.category.length <= kMaxCategoryLen, Tags.badValue,
       ["category"], cb)) {
         body.timePosted = new Date().getTime();
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
      if (vld.check(req.session, Tags.noLogin, null, cb) &&
       vld.chain(!body.title || body.title.length <= kMaxTitleLen,
       Tags.badValue, ["title"], cb)
       .chain(!body.content || body.content.length <= kMaxContentLen,
       Tags.badValue, ["content"], cb)
       .chain(!body.contributors || body.contributors.length <= kMaxContributorsLen,
       Tags.badValue, ["contributors"], cb)
       .chain(!body.category || body.category.length <= kMaxCategoryLen,
       Tags.badValue, ["category"], cb))
         cnn.chkQry('select * from Project where id = ?', [prjId], cb);
   },
   function(prjs, fields, cb) {
      if (vld.check(prjs.length, Tags.notFound, null, cb) && 
       vld.checkPrsOK(prjs[0].ownerId, cb))
         cnn.chkQry('update Project set title = ?, content = ?, ' +
          'thumbnail = ?, contributors = ?, category = ? where id = ?',
          [body.title || prjs[0].title, body.content || prjs[0].content,
          body.thumbnail || prjs[0].thumbnail,
          body.contributors || prjs[0].contributors,
          body.category || prjs[0].category, prjId], cb);
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
