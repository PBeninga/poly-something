var Express = require('express');
var Tags = require('../Validator.js').Tags;
var async = require('async');
var mysql = require('mysql');

var router = Express.Router({caseSensitive: true});

router.baseURL = '/Prss';
/* Much nicer versions
*/
router.get('/', function(req, res) {
   var email = req.session.isAdmin() && req.query.email
   if(!req.session.isAdmin() && !req.query.email){
      email = req.session.email
   }else if(!req.session.isAdmin() && req.session.email.toLowerCase().
            indexOf(req.query.email.toLowerCase()) === 0){
      email = req.session.email;
   }else if(!req.session.isAdmin()){
      email =  "**************"
   }

   var handler = function(err, prsArr) {
      res.json(prsArr);
      req.cnn.release();
   };
   if (email && req.session.isAdmin()){
      req.cnn.chkQry('select id, email from Person where email LIKE ?', 
      [email+"%"], handler);
   }else if(email){
      req.cnn.chkQry('select id, email from Person where email = ?', 
      [email], handler);
   }
   else
      req.cnn.chkQry('select id, email from Person', handler);
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password)
      body.password = "*";
   body.whenRegistered = new Date().getTime();

   async.waterfall([
   function(cb) { // Check properties and search for Email duplicates
      if (vld.hasFields(body, ["email", "password", "role", "lastName"], cb) &&
       vld.chain(body.role === 0 || admin, Tags.noPermission)
       .chain(body.termsAccepted || admin, Tags.noTerms)
       .check(body.role === 0  || body.role === 1, Tags.badValue, 
         ["role"], cb)) {
         cnn.chkQry('select * from Person where email = ?', body.email, cb)
      }
   },
   function(existingPrss, fields, cb) {  // If no duplicates, insert new Person
      if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
         if(body.termsAccepted)
            body.termsAccepted = new Date().getTime();
         cnn.chkQry('insert into Person set ?', body, cb);
      }
   },
   function(result, fields, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result.insertId).end();
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

router.put('/:id', function(req, res) {
   // Class exercise
   var vld = req.validator;	
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;
   async.waterfall([function(cb){
         if (vld.checkPrsOK(req.params.id, cb) && 
            vld.chain(!("termsAccepted" in body), Tags.forbiddenField, 
            ['termsAccepted']).
            chain(!("whenRegistered" in body), Tags.forbiddenField, 
            ['whenRegistered']).
            chain(!("email" in body),  Tags.forbiddenField, ['email']).
            chain((admin  && (body.role == 0 || body.role == 1) || 
            !("role" in body) || body.role == 0), Tags.badValue, ['role']).
            check(!("password" in body) || (body.password !== "" &&
             body.password), Tags.badValue, ['password'],cb)){
            req.cnn.chkQry('select * from Person where id = ?', 
            [req.params.id], cb);   
       }else{
          cb();
       }},
       function(prsArr, fields, cb){
         if(vld.check(prsArr !== 1, Tags.notFound, ['notFound'], cb) && 
            vld.check("oldPassword" in body || admin || !("password" in body), 
            Tags.noOldPwd, null, cb) &&
            vld.check(body.oldPassword === prsArr[0]['password'] 
                     || admin || !("password" in body), 
                     Tags.oldPwdMismatch, ['oldPwdMismatch'], cb)){
                     delete body.oldPassword;
                     console.log(body)
                     if(!Object.keys(body).length){
                        cb()
                     }else{
                        cnn.chkQry('update Person set ? where id = ?', 
                                    [body, req.params.id], cb)
                     }
               }          
       }
   ], function(err){
       if(!err){
          res.status(200).end();
       }
       console.log("released")
       cnn.release();
      });
   
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
     if (vld.checkPrsOK(req.params.id, cb))
        req.cnn.chkQry('select * from Person where id = ?', [req.params.id],
         cb);
   },
   function(prsArr, fields, cb) {
      if (vld.check(prsArr.length, Tags.notFound, null, cb)) {
         delete prsArr[0].password;
         res.json(prsArr);
         cb();
      }
   },
   function(cb){
      res.status(200).end();
      console.log(cb);
      cb(null);
   }],
   function(err) {
      console.log("here");
      if(err){
         res.status(400).send();
      }
      req.cnn.release();
   });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkAdmin())
      req.cnn.query('DELETE from Person where id = ?', [req.params.id],
      function (err, result) {
         if (vld.check(!err, Tags.queryFailed, null, null) && 
             vld.check(result.affectedRows, Tags.notFound))
            res.status(200).end();
         req.cnn && req.cnn.release();
      });
   else {
      req.cnn && req.cnn.release();
   }
});

module.exports = router;
