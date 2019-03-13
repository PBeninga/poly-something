var Express = require('express');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});

router.baseURL = '/REST/Ssns';

router.get('/', function(req, res) {
   var body = [], ssn;

   if (req.validator.checkAdmin()) {
      for (var cookie in ssnUtil.sessions) {
         ssn = ssnUtil.sessions[cookie];
         body.push({cookie: cookie, prsId: ssn.id, loginTime: ssn.loginTime});
      }
      res.status(200).json(body);
   }
   req.cnn && req.cnn.release()
});

router.post('/', function(req, res) {
   var cookie;
   var cnn = req.cnn;

   cnn.query('select * from Person where email = ?', [req.body.email],
   function(err, result) {
      if (req.validator.check(result.length && result[0].password ===
       req.body.password, Tags.badLogin)) {
         cookie = ssnUtil.makeSession(result[0], res);
         res.location(router.baseURL + '/' + cookie).status(200).end();
      }
      cnn && cnn.release();
   });
});

// DELETE ..../SSns/ff73647f737f7
router.delete('/:cookie', function(req, res) {
   if (req.validator.check(req.params.cookie === 
       req.cookies[ssnUtil.cookieName] || req.session.isAdmin(),
    Tags.noPermission)) {
      ssnUtil.deleteSession(req.params.cookie);
      res.status(200).end();
   }
   req.cnn && req.cnn.release();
});

router.get('/:cookie', function(req, res) {
   var cookie = req.params.cookie;
   var vld = req.validator;

   if (vld.check(ssnUtil.sessions[cookie], Tags.notFound, null, null) && 
       vld.checkPrsOK(ssnUtil.sessions[cookie].id)) {
      res.json({cookie:cookie, prsId: ssnUtil.sessions[cookie].id, 
               loginTime:ssnUtil.sessions[cookie].loginTime});
   }
   req.cnn && req.cnn.release();
});

module.exports = router;
